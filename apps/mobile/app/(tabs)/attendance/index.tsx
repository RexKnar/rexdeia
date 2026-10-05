import * as Haptics from 'expo-haptics';
import { Check, CheckCheck, Clock, Search, Users, X } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../../src/components/Button';
import { Header } from '../../../src/components/Header';
import { OfflineStatusBar } from '../../../src/components/OfflineStatusBar';
import { useNetworkSync } from '../../../src/context/network-sync';
import { api } from '../../../src/lib/api';
import { SyncQueue } from '../../../src/lib/sync-queue';
import { COLORS } from '../../../src/theme/colors';

interface StudentRecord {
  id: string;
  rollNo: string;
  name: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
}

const INITIAL_STUDENTS: StudentRecord[] = [
  { id: 'std-1', rollNo: '01', name: 'Aarav Sharma', status: 'PRESENT' },
  { id: 'std-2', rollNo: '02', name: 'Ananya Patel', status: 'PRESENT' },
  { id: 'std-3', rollNo: '03', name: 'Devansh Verma', status: 'PRESENT' },
  { id: 'std-4', rollNo: '04', name: 'Ishita Nair', status: 'PRESENT' },
  { id: 'std-5', rollNo: '05', name: 'Kabir Mehta', status: 'ABSENT' },
  { id: 'std-6', rollNo: '06', name: 'Meera Iyer', status: 'PRESENT' },
  { id: 'std-7', rollNo: '07', name: 'Rohan Gupta', status: 'PRESENT' },
  { id: 'std-8', rollNo: '08', name: 'Sanya Malhotra', status: 'LATE' },
  { id: 'std-9', rollNo: '09', name: 'Vihaan Joshi', status: 'PRESENT' },
  { id: 'std-10', rollNo: '10', name: 'Zoya Khan', status: 'PRESENT' },
];

export default function AttendanceScreen() {
  const { isOnline } = useNetworkSync();
  const [students, setStudents] = useState<StudentRecord[]>(INITIAL_STUDENTS);
  const [selectedSection, setSelectedSection] = useState('Grade 10 - Section A');
  const [searchQuery, setSearchQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedbackBanner, setFeedbackBanner] = useState<{
    type: 'success' | 'offline';
    text: string;
  } | null>(null);

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    const q = searchQuery.toLowerCase();
    return students.filter(
      (s) => s.name.toLowerCase().includes(q) || s.rollNo.includes(q)
    );
  }, [students, searchQuery]);

  const stats = useMemo(() => {
    const present = students.filter((s) => s.status === 'PRESENT').length;
    const absent = students.filter((s) => s.status === 'ABSENT').length;
    const late = students.filter((s) => s.status === 'LATE').length;
    return { total: students.length, present, absent, late };
  }, [students]);

  const updateStatus = async (
    id: string,
    newStatus: 'PRESENT' | 'ABSENT' | 'LATE'
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
    setStudents((prev) => prev.map((s) => ({ ...s, status: 'PRESENT' })));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setFeedbackBanner(null);

    const payload = {
      section: selectedSection,
      date: new Date().toISOString().split('T')[0],
      attendance: students.map((s) => ({
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
          text: 'Attendance successfully submitted and saved on server.',
        });
      } else {
        // Offline mode: Enqueue mutation in persistent local storage
        await SyncQueue.enqueue('ATTENDANCE', '/api/mobile/v1/attendance', payload);
        try {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch {}
        setFeedbackBanner({
          type: 'offline',
          text: '⚡ Saved offline! Changes will sync automatically when online.',
        });
      }
    } catch (err: any) {
      // Fallback: Queue offline if network failed mid-flight
      await SyncQueue.enqueue('ATTENDANCE', '/api/mobile/v1/attendance', payload);
      setFeedbackBanner({
        type: 'offline',
        text: 'Network issue. Saved offline and queued for automatic sync.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header
        title="Student Attendance"
        subtitle={selectedSection}
      />

      <OfflineStatusBar />

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
          <Text style={[styles.statLabel, { color: COLORS.warning }]}>Late</Text>
          <Text style={[styles.statValue, { color: COLORS.warning }]}>
            {stats.late}
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

      {/* Roster List */}
      <FlatList
        data={filteredStudents}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.studentCard}>
            <View style={styles.studentInfo}>
              <View style={styles.rollBadge}>
                <Text style={styles.rollText}>{item.rollNo}</Text>
              </View>
              <Text style={styles.studentName}>{item.name}</Text>
            </View>

            <View style={styles.statusButtons}>
              <TouchableOpacity
                style={[
                  styles.statusBtn,
                  item.status === 'PRESENT' && styles.btnPresentActive,
                ]}
                onPress={() => updateStatus(item.id, 'PRESENT')}
              >
                <Check
                  size={16}
                  color={
                    item.status === 'PRESENT' ? '#ffffff' : COLORS.textMuted
                  }
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.statusBtn,
                  item.status === 'ABSENT' && styles.btnAbsentActive,
                ]}
                onPress={() => updateStatus(item.id, 'ABSENT')}
              >
                <X
                  size={16}
                  color={item.status === 'ABSENT' ? '#ffffff' : COLORS.textMuted}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.statusBtn,
                  item.status === 'LATE' && styles.btnLateActive,
                ]}
                onPress={() => updateStatus(item.id, 'LATE')}
              >
                <Clock
                  size={15}
                  color={item.status === 'LATE' ? '#ffffff' : COLORS.textMuted}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Submit Button Bar */}
      <View style={styles.footer}>
        <Button
          title={isOnline ? 'Submit Attendance' : 'Save Offline (Sync Later)'}
          onPress={handleSubmit}
          isLoading={submitting}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
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
});
