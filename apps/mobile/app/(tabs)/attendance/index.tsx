import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams } from 'expo-router';
import {
  Calendar,
  Check,
  CheckCheck,
  ChevronDown,
  Clock,
  RefreshCw,
  Search,
  Users,
  X,
} from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../../src/components/Button';
import { ClassItem, SectionItem } from '../../../src/components/ClassDetailCards';
import { Header } from '../../../src/components/Header';
import { OfflineStatusBar } from '../../../src/components/OfflineStatusBar';
import { useAuth } from '../../../src/context/auth';
import { useNetworkSync } from '../../../src/context/network-sync';
import { api } from '../../../src/lib/api';
import { SyncQueue } from '../../../src/lib/sync-queue';
import { COLORS } from '../../../src/theme/colors';

export interface AttendanceStudentRow {
  id: string;
  rollNo: string;
  name: string;
  status: 'Present' | 'Absent' | 'Leave';
}

export default function AttendanceScreen() {
  const { user } = useAuth();
  const { isOnline } = useNetworkSync();
  const params = useLocalSearchParams<{
    classId?: string;
    className?: string;
    sectionId?: string;
    sectionName?: string;
  }>();

  // Selected Class & Section
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(params.classId || null);
  const [selectedClassName, setSelectedClassName] = useState<string>(params.className || '');
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(params.sectionId || null);
  const [selectedSectionName, setSelectedSectionName] = useState<string>(params.sectionName || '');

  // Date State (YYYY-MM-DD)
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // Student list & status
  const [students, setStudents] = useState<AttendanceStudentRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Class/Section Picker Modal
  const [pickerModalVisible, setPickerModalVisible] = useState(false);

  // Feedback banner
  const [feedbackBanner, setFeedbackBanner] = useState<{
    type: 'success' | 'offline';
    text: string;
  } | null>(null);

  // User-scoped cache key
  const cacheKey =
    user?.id && selectedSectionId
      ? `@rexdeia_attendance_${user.id}_${selectedSectionId}_${selectedDate}`
      : null;

  // 1. Fetch assigned classes and sections
  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      try {
        const res = await api.get<{ data: ClassItem[] }>('/api/mobile/v1/classes');
        if (res && Array.isArray(res.data) && res.data.length > 0) {
          setClasses(res.data);

          // If no section chosen yet, default to first available
          if (!selectedSectionId) {
            const firstClass = res.data[0];
            setSelectedClassId(firstClass.id);
            setSelectedClassName(firstClass.name);

            if (firstClass.sections && firstClass.sections.length > 0) {
              const firstSec = firstClass.sections[0];
              const sId = typeof firstSec === 'object' ? firstSec.id : undefined;
              const sName = typeof firstSec === 'object' ? firstSec.name : firstSec;
              if (sId) setSelectedSectionId(sId);
              if (sName) setSelectedSectionName(sName);
            }
          }
        }
      } catch (err: any) {
        if (err?.message !== 'SESSION_EXPIRED') {
          console.warn('Failed to load classes for attendance:', err);
        }
      }
    })();
  }, [user?.id]);

  // Load cached attendance
  useEffect(() => {
    if (!cacheKey) return;
    (async () => {
      try {
        const cached = await AsyncStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setStudents(parsed);
            setIsLoading(false);
          }
        }
      } catch {}
    })();
  }, [cacheKey]);

  // 2. Fetch live attendance roster for selected section & date
  const fetchAttendanceRoster = useCallback(
    async (isPull = false) => {
      if (!selectedSectionId || !user?.id) {
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }

      if (isPull) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setErrorMessage(null);

      try {
        const url = `/api/mobile/v1/attendance?sectionId=${selectedSectionId}&date=${selectedDate}&scope=daily`;
        const res = await api.get<{
          structureMissing: boolean;
          students: {
            studentId: string;
            name: string;
            rollNumber: number | null;
            status: 'Present' | 'Absent' | 'Leave' | null;
          }[];
        }>(url);

        if (res && Array.isArray(res.students)) {
          const mapped: AttendanceStudentRow[] = res.students.map((st, idx) => ({
            id: st.studentId,
            rollNo: st.rollNumber !== null && st.rollNumber !== undefined ? String(st.rollNumber) : String(idx + 1),
            name: st.name,
            status: (st.status as 'Present' | 'Absent' | 'Leave') || 'Present',
          }));
          setStudents(mapped);

          if (cacheKey) {
            await AsyncStorage.setItem(cacheKey, JSON.stringify(mapped)).catch(() => {});
          }
        } else {
          setStudents([]);
        }
      } catch (err: any) {
        if (err?.message !== 'SESSION_EXPIRED') {
          setErrorMessage(err?.message || 'Failed to load student attendance roster.');
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [selectedSectionId, selectedDate, user?.id, cacheKey]
  );

  useEffect(() => {
    fetchAttendanceRoster();
  }, [fetchAttendanceRoster]);

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    const q = searchQuery.toLowerCase();
    return students.filter(
      (s) => s.name.toLowerCase().includes(q) || s.rollNo.includes(q)
    );
  }, [students, searchQuery]);

  const stats = useMemo(() => {
    const present = students.filter((s) => s.status === 'Present').length;
    const absent = students.filter((s) => s.status === 'Absent').length;
    const leave = students.filter((s) => s.status === 'Leave').length;
    return { total: students.length, present, absent, leave };
  }, [students]);

  const updateStatus = async (
    id: string,
    newStatus: 'Present' | 'Absent' | 'Leave'
  ) => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
  };

  const markAllPresent = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    setStudents((prev) => prev.map((s) => ({ ...s, status: 'Present' })));
  };

  const handleSubmit = async () => {
    if (!selectedSectionId || students.length === 0) return;
    setSubmitting(true);
    setFeedbackBanner(null);

    const payload = {
      sectionId: selectedSectionId,
      date: selectedDate,
      scope: 'daily' as const,
      statuses: students.map((s) => ({
        studentId: s.id,
        status: s.status,
      })),
    };

    try {
      if (isOnline) {
        await api.post('/api/mobile/v1/attendance', payload);
        try {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch {}
        setFeedbackBanner({
          type: 'success',
          text: 'Attendance successfully submitted and recorded on server.',
        });
      } else {
        await SyncQueue.enqueue('ATTENDANCE', '/api/mobile/v1/attendance', payload);
        try {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch {}
        setFeedbackBanner({
          type: 'offline',
          text: 'Saved offline! Changes will sync automatically when online.',
        });
      }
    } catch (err: any) {
      await SyncQueue.enqueue('ATTENDANCE', '/api/mobile/v1/attendance', payload);
      setFeedbackBanner({
        type: 'offline',
        text: 'Network issue. Saved offline and queued for automatic sync.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const sectionSubtitle = selectedClassName && selectedSectionName
    ? `Class ${selectedClassName} - Section ${selectedSectionName}`
    : selectedSectionName
    ? `Section ${selectedSectionName}`
    : 'Select Section';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header
        title="Student Attendance"
        subtitle={sectionSubtitle}
      />

      <OfflineStatusBar />

      {/* Section & Date Switcher Bar */}
      <View style={styles.selectionBar}>
        <TouchableOpacity
          style={styles.sectionPickerBtn}
          onPress={() => setPickerModalVisible(true)}
          activeOpacity={0.8}
        >
          <Users size={16} color={COLORS.primary} />
          <Text style={styles.sectionPickerText} numberOfLines={1}>
            {sectionSubtitle}
          </Text>
          <ChevronDown size={14} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <View style={styles.dateBadge}>
          <Calendar size={13} color={COLORS.textSecondary} />
          <Text style={styles.dateBadgeText}>{selectedDate}</Text>
        </View>
      </View>

      {feedbackBanner ? (
        <View
          style={[
            styles.banner,
            feedbackBanner.type === 'offline'
              ? styles.bannerOffline
              : styles.bannerSuccess,
          ]}
        >
          <Text
            style={[
              styles.bannerText,
              feedbackBanner.type === 'offline'
                ? styles.bannerOfflineText
                : styles.bannerSuccessText,
            ]}
          >
            {feedbackBanner.text}
          </Text>
        </View>
      ) : null}

      {/* Stats Summary Bar */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Total</Text>
          <Text style={styles.statValue}>{stats.total}</Text>
        </View>
        <View style={[styles.statBox, styles.statBoxSuccess]}>
          <Text style={[styles.statLabel, { color: COLORS.success }]}>Present</Text>
          <Text style={[styles.statValue, { color: COLORS.success }]}>
            {stats.present}
          </Text>
        </View>
        <View style={[styles.statBox, styles.statBoxDanger]}>
          <Text style={[styles.statLabel, { color: COLORS.danger }]}>Absent</Text>
          <Text style={[styles.statValue, { color: COLORS.danger }]}>
            {stats.absent}
          </Text>
        </View>
        <View style={[styles.statBox, styles.statBoxWarning]}>
          <Text style={[styles.statLabel, { color: COLORS.warning }]}>Leave</Text>
          <Text style={[styles.statValue, { color: COLORS.warning }]}>
            {stats.leave}
          </Text>
        </View>
      </View>

      {/* Filter and Bulk Action */}
      <View style={styles.actionsBar}>
        <View style={styles.searchWrapper}>
          <Search size={16} color={COLORS.textMuted} style={styles.searchIcon} />
          <TextInput
            placeholder="Search student or roll no..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
        </View>

        <TouchableOpacity style={styles.markAllBtn} onPress={markAllPresent}>
          <CheckCheck size={14} color={COLORS.primary} />
          <Text style={styles.markAllText}>All Present</Text>
        </TouchableOpacity>
      </View>

      {/* Roster List or States */}
      {isLoading && students.length === 0 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.centerText}>Loading students...</Text>
        </View>
      ) : filteredStudents.length === 0 ? (
        <View style={styles.centerContainer}>
          <Users size={48} color={COLORS.textMuted} />
          <Text style={styles.emptyTitle}>
            {searchQuery ? 'No Matching Students' : 'No Data Available'}
          </Text>
          <Text style={styles.emptySubtitle}>
            {searchQuery
              ? `No students found matching "${searchQuery}"`
              : selectedSectionId
              ? 'No students found enrolled in this section.'
              : 'Please select a class and section above.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredStudents}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshing={isRefreshing}
          onRefresh={() => fetchAttendanceRoster(true)}
          renderItem={({ item }) => (
            <View style={styles.studentCard}>
              <View style={styles.studentInfo}>
                <View style={styles.rollBadge}>
                  <Text style={styles.rollText}>{item.rollNo}</Text>
                </View>
                <Text style={styles.studentName} numberOfLines={1}>
                  {item.name}
                </Text>
              </View>

              <View style={styles.statusButtons}>
                <TouchableOpacity
                  style={[
                    styles.statusBtn,
                    item.status === 'Present' && styles.btnPresentActive,
                  ]}
                  onPress={() => updateStatus(item.id, 'Present')}
                >
                  <Check
                    size={16}
                    color={item.status === 'Present' ? '#ffffff' : COLORS.textMuted}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.statusBtn,
                    item.status === 'Absent' && styles.btnAbsentActive,
                  ]}
                  onPress={() => updateStatus(item.id, 'Absent')}
                >
                  <X
                    size={16}
                    color={item.status === 'Absent' ? '#ffffff' : COLORS.textMuted}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.statusBtn,
                    item.status === 'Leave' && styles.btnLateActive,
                  ]}
                  onPress={() => updateStatus(item.id, 'Leave')}
                >
                  <Clock
                    size={15}
                    color={item.status === 'Leave' ? '#ffffff' : COLORS.textMuted}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* Submit Button Bar */}
      {students.length > 0 && (
        <View style={styles.footer}>
          <Button
            title={isOnline ? 'Submit Attendance' : 'Save Offline (Sync Later)'}
            onPress={handleSubmit}
            isLoading={submitting}
          />
        </View>
      )}

      {/* Class / Section Picker Modal */}
      <Modal
        visible={pickerModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setPickerModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Class & Section</Text>
              <TouchableOpacity onPress={() => setPickerModalVisible(false)}>
                <X size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalList} showsVerticalScrollIndicator={false}>
              {classes.map((cls) => (
                <View key={cls.id} style={styles.modalClassGroup}>
                  <Text style={styles.modalClassHeader}>Class {cls.name}</Text>
                  <View style={styles.modalSectionGrid}>
                    {cls.sections.map((sec, idx) => {
                      const secId = typeof sec === 'object' ? sec.id : undefined;
                      const secName = typeof sec === 'object' ? sec.name : sec;
                      const isSelected = secId && secId === selectedSectionId;

                      return (
                        <TouchableOpacity
                          key={`${cls.id}-${secName}-${idx}`}
                          style={[
                            styles.modalSectionButton,
                            isSelected && styles.modalSectionButtonActive,
                          ]}
                          onPress={() => {
                            setSelectedClassId(cls.id);
                            setSelectedClassName(cls.name);
                            if (secId) setSelectedSectionId(secId);
                            setSelectedSectionName(secName);
                            setPickerModalVisible(false);
                          }}
                        >
                          <Text
                            style={[
                              styles.modalSectionButtonText,
                              isSelected && styles.modalSectionButtonTextActive,
                            ]}
                          >
                            Section {secName}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  selectionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  sectionPickerBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.surfaceCard,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  sectionPickerText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.surfaceCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  dateBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  banner: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
  },
  bannerSuccess: {
    backgroundColor: COLORS.successLight,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderWidth: 1,
  },
  bannerOffline: {
    backgroundColor: COLORS.offlineBg,
    borderColor: '#78350f',
    borderWidth: 1,
  },
  bannerText: {
    fontSize: 13,
    fontWeight: '500',
  },
  bannerSuccessText: {
    color: COLORS.success,
  },
  bannerOfflineText: {
    color: COLORS.offlineText,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.surfaceCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  statBoxSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  statBoxDanger: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  statBoxWarning: {
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  actionsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 12,
  },
  searchWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 13,
    paddingVertical: 8,
  },
  markAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 8,
  },
  markAllText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 10,
  },
  centerText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 8,
  },
  emptyTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
  },
  emptySubtitle: {
    color: COLORS.textMuted,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  rollBadge: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: COLORS.surfaceHover,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rollText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
  studentName: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  statusBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceHover,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  btnPresentActive: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  btnAbsentActive: {
    backgroundColor: COLORS.danger,
    borderColor: COLORS.danger,
  },
  btnLateActive: {
    backgroundColor: COLORS.warning,
    borderColor: COLORS.warning,
  },
  footer: {
    padding: 16,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  modalList: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  modalClassGroup: {
    marginBottom: 16,
  },
  modalClassHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  modalSectionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modalSectionButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalSectionButtonActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#5C54F6',
  },
  modalSectionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  modalSectionButtonTextActive: {
    color: '#5C54F6',
  },
});
