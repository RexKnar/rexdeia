import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  AlertCircle,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Filter,
  Save,
  Search,
  SlidersHorizontal,
  Sparkles,
  UserX,
} from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../../src/components/Header';
import {
  FilterResult,
  MarkEntryFilterModal,
} from '../../../src/components/MarkEntryFilterModal';
import { OfflineStatusBar } from '../../../src/components/OfflineStatusBar';
import { useAuth } from '../../../src/context/auth';
import { useNetworkSync } from '../../../src/context/network-sync';
import { api } from '../../../src/lib/api';
import { SyncQueue } from '../../../src/lib/sync-queue';

export interface AssessmentPartition {
  id: string;
  examSubjectId: string;
  subjectId: string;
  assessmentFormatId: string;
  minMark: string | number;
  totalMarks: string | number;
  convertTo?: string | number;
  assessmentFormat: {
    id: string;
    name: string;
  };
  Mark?: {
    id: string;
    mark: number | string | null;
    attandance: number | null; // 1 = absent, 0 = present
  } | null;
}

export interface ExamSubject {
  id: string;
  subject: {
    id: string;
    name: string;
  };
  examSubjectPartition: AssessmentPartition[];
}

export interface MarkEntryStudent {
  id: string;
  rollNumber?: string | number;
  firstName: string;
  middleName?: string;
  lastName?: string;
  examSubjects: ExamSubject[];
}

interface StudentPartitionState {
  mark: string;
  isAbsent: boolean;
  markId?: string;
  examSubjectId: string;
  subjectId: string;
  assessmentFormatId: string;
  examSubjectPartitionId: string;
  maxMark: number;
  minMark: number;
}

export default function ExamsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { isOnline } = useNetworkSync();
  const routeParams = useLocalSearchParams<{
    classId?: string;
    sectionId?: string;
    examId?: string;
    subjectId?: string;
    staffId?: string;
  }>();

  // Filters State
  const [filters, setFilters] = useState<FilterResult | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Roster & Permissions State
  const [students, setStudents] = useState<MarkEntryStudent[]>([]);
  const [permissions, setPermissions] = useState<{
    canEnterMarks: boolean;
    message?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Active Subject Tab (for multiple subjects / incharge)
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);

  // Editable marks map: key is `${studentId}_${partitionId}`
  const [marksState, setMarksState] = useState<Record<string, StudentPartitionState>>({});
  const [dirtyKeys, setDirtyKeys] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [bannerNotice, setBannerNotice] = useState<{ text: string; isOffline?: boolean } | null>(null);

  // User-scoped cache key
  const cacheKey = useMemo(() => {
    if (!user?.id || !filters?.examId || !filters?.classId || !filters?.sectionId) return null;
    const sub = filters.subjectId ? `_${filters.subjectId}` : '';
    return `@rexdeia_mark_entry_${user.id}_${filters.examId}_${filters.classId}_${filters.sectionId}${sub}`;
  }, [user?.id, filters]);

  // Load cached marks if available
  useEffect(() => {
    if (!cacheKey) return;
    (async () => {
      try {
        const cached = await AsyncStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed?.students && parsed.students.length > 0) {
            setStudents(parsed.students);
            if (parsed.permissions) setPermissions(parsed.permissions);
            if (parsed.marksState) setMarksState(parsed.marksState);
          }
        }
      } catch { }
    })();
  }, [cacheKey]);

  // Extract unique subjects across all students
  const availableSubjects = useMemo(() => {
    const map = new Map<string, { id: string; name: string }>();
    students.forEach((st) => {
      st.examSubjects?.forEach((es) => {
        if (es.subject?.id && !map.has(es.subject.id)) {
          map.set(es.subject.id, { id: es.subject.id, name: es.subject.name });
        }
      });
    });
    return Array.from(map.values());
  }, [students]);

  // Keep activeSubjectId in sync with available subjects
  useEffect(() => {
    if (availableSubjects.length > 0) {
      if (!activeSubjectId || !availableSubjects.some((s) => s.id === activeSubjectId)) {
        setActiveSubjectId(availableSubjects[0].id);
      }
    } else {
      setActiveSubjectId(null);
    }
  }, [availableSubjects]);

  // Fetch Mark Entry Roster from API
  const fetchMarkEntries = useCallback(
    async (appliedFilters: FilterResult, isPullRefresh = false) => {
      if (!appliedFilters.classId || !appliedFilters.sectionId || !appliedFilters.examId) {
        return;
      }

      if (isPullRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setBannerNotice(null);

      try {
        const queryParams = new URLSearchParams({
          classId: appliedFilters.classId,
          sectionId: appliedFilters.sectionId,
          examId: appliedFilters.examId,
          ...(appliedFilters.staffId ? { staffId: appliedFilters.staffId } : {}),
          ...(appliedFilters.subjectId ? { subjectId: appliedFilters.subjectId } : {}),
        }).toString();

        const res = await api.get<{
          success: boolean;
          data: MarkEntryStudent[];
          permissions: { canEnterMarks: boolean; message?: string };
        }>(`/api/mobile/v1/exam/mark-entry?${queryParams}`);

        const fetchedStudents = res?.data || [];
        const fetchedPerms = res?.permissions || { canEnterMarks: false };

        setStudents(fetchedStudents);
        setPermissions(fetchedPerms);

        // Populate initial marksState from API data
        const initialMap: Record<string, StudentPartitionState> = {};
        for (const st of fetchedStudents) {
          for (const sub of st.examSubjects || []) {
            for (const part of sub.examSubjectPartition || []) {
              const key = `${st.id}_${part.id}`;
              const existingMark = part.Mark;
              const isAbsent = existingMark?.attandance === 1;
              const markStr =
                isAbsent || existingMark?.mark === null || existingMark?.mark === undefined
                  ? ''
                  : String(existingMark.mark);

              const pMin =
                Number(part.minMark) > 0
                  ? Number(part.minMark)
                  : Math.round(Number(part.totalMarks || 100) * 0.35);

              initialMap[key] = {
                mark: markStr,
                isAbsent,
                markId: existingMark?.id,
                examSubjectId: part.examSubjectId,
                subjectId: part.subjectId,
                assessmentFormatId: part.assessmentFormatId,
                examSubjectPartitionId: part.id,
                maxMark: Number(part.totalMarks || 100),
                minMark: pMin,
              };
            }
          }
        }

        setMarksState(initialMap);
        setDirtyKeys(new Set());

        // Cache result
        if (cacheKey) {
          await AsyncStorage.setItem(
            cacheKey,
            JSON.stringify({
              students: fetchedStudents,
              permissions: fetchedPerms,
              marksState: initialMap,
            })
          ).catch(() => { });
        }
      } catch (err: any) {
        const errorMsg = err?.data?.error || err?.message || 'Failed to load mark entry roster.';
        Alert.alert('Error', errorMsg);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [cacheKey]
  );

  // Apply filters from modal
  const handleApplyFilters = (newFilters: FilterResult) => {
    setFilters(newFilters);
    if (newFilters.subjectId) {
      setActiveSubjectId(newFilters.subjectId);
    }
    fetchMarkEntries(newFilters, false);
  };

  // Route params on initial load
  useEffect(() => {
    if (routeParams.classId && routeParams.sectionId && routeParams.examId) {
      const initial: FilterResult = {
        classId: routeParams.classId,
        className: 'Class',
        sectionId: routeParams.sectionId,
        sectionName: 'Section',
        examId: routeParams.examId,
        examName: 'Exam',
        subjectId: routeParams.subjectId,
        staffId: routeParams.staffId,
      };
      setFilters(initial);
      if (routeParams.subjectId) {
        setActiveSubjectId(routeParams.subjectId);
      }
      fetchMarkEntries(initial, false);
    }
  }, [routeParams.classId, routeParams.sectionId, routeParams.examId, routeParams.subjectId]);

  // Handle Mark Input Change
  const handleMarkChange = (studentId: string, partition: AssessmentPartition, text: string) => {
    if (permissions && !permissions.canEnterMarks) return;

    const key = `${studentId}_${partition.id}`;
    const cleaned = text.replace(/[^0-9]/g, '');
    const max = Number(partition.totalMarks || 100);

    if (cleaned && parseInt(cleaned, 10) > max) {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } catch { }
      Alert.alert('Invalid Mark', `Mark cannot exceed maximum marks (${max}).`);
      return;
    }

    const pMin =
      Number(partition.minMark) > 0
        ? Number(partition.minMark)
        : Math.round(Number(partition.totalMarks || 100) * 0.35);

    setMarksState((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] || {
          markId: partition.Mark?.id,
          examSubjectId: partition.examSubjectId,
          subjectId: partition.subjectId,
          assessmentFormatId: partition.assessmentFormatId,
          examSubjectPartitionId: partition.id,
          maxMark: max,
          minMark: pMin,
        }),
        mark: cleaned,
        isAbsent: false,
        minMark: pMin,
      },
    }));

    setDirtyKeys((prev) => new Set(prev).add(key));
  };

  // Toggle Absent state
  const handleToggleAbsent = (studentId: string, partition: AssessmentPartition) => {
    if (permissions && !permissions.canEnterMarks) return;

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch { }

    const key = `${studentId}_${partition.id}`;
    const pMin =
      Number(partition.minMark) > 0
        ? Number(partition.minMark)
        : Math.round(Number(partition.totalMarks || 100) * 0.35);

    const current = marksState[key] || {
      mark: '',
      isAbsent: false,
      markId: partition.Mark?.id,
      examSubjectId: partition.examSubjectId,
      subjectId: partition.subjectId,
      assessmentFormatId: partition.assessmentFormatId,
      examSubjectPartitionId: partition.id,
      maxMark: Number(partition.totalMarks || 100),
      minMark: pMin,
    };

    const nextAbsent = !current.isAbsent;

    setMarksState((prev) => ({
      ...prev,
      [key]: {
        ...current,
        isAbsent: nextAbsent,
        mark: nextAbsent ? '' : current.mark,
        minMark: pMin,
      },
    }));

    setDirtyKeys((prev) => new Set(prev).add(key));
  };

  // Save modified marks
  const handleSaveMarks = async () => {
    if (dirtyKeys.size === 0) {
      Alert.alert('No Changes', 'No new mark entries or modifications to save.');
      return;
    }

    try {
      setIsSaving(true);
      setBannerNotice(null);
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch { }

      const entriesToSave = Array.from(dirtyKeys).map((key) => {
        const [studentId] = key.split('_');
        const stState = marksState[key];
        return {
          studentId,
          userId: user?.id,
          examSubjectId: stState.examSubjectId,
          subjectId: stState.subjectId,
          assessmentFormatId: stState.assessmentFormatId,
          examSubjectPartitionId: stState.examSubjectPartitionId,
          ...(stState.markId ? { id: stState.markId } : {}),
          mark: stState.isAbsent ? null : stState.mark ? parseFloat(stState.mark) : null,
          attendance: stState.isAbsent,
        };
      });

      const payload = {
        studentsMarkDetails: entriesToSave,
      };

      if (isOnline) {
        await api.post('/api/mobile/v1/exam/mark-entry', payload);
        try {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch { }
        setBannerNotice({ text: 'All marks saved to server successfully!', isOffline: false });
      } else {
        await SyncQueue.enqueue('MARK_ENTRY', '/api/mobile/v1/exam/mark-entry', payload);
        try {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch { }
        setBannerNotice({
          text: '⚡ Marks saved offline! Will sync automatically when online.',
          isOffline: true,
        });
      }

      setDirtyKeys(new Set());

      // Update cache
      if (cacheKey) {
        await AsyncStorage.setItem(
          cacheKey,
          JSON.stringify({
            students,
            permissions,
            marksState,
          })
        ).catch(() => { });
      }
    } catch (err: any) {
      const msg = err?.data?.error || err?.message || 'Failed to save marks.';
      Alert.alert('Save Failed', msg);
    } finally {
      setIsSaving(false);
    }
  };

  // Filter students by search query
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    const q = searchQuery.toLowerCase().trim();
    return students.filter((s) => {
      const fullName = `${s.firstName} ${s.middleName || ''} ${s.lastName || ''}`.toLowerCase();
      const roll = String(s.rollNumber || '').toLowerCase();
      return fullName.includes(q) || roll.includes(q);
    });
  }, [students, searchQuery]);

  // Active Subject's partitions in assessment format order (partition.order)
  const activePartitions = useMemo(() => {
    if (students.length === 0) return [];
    for (const st of students) {
      const es = st.examSubjects?.find((s) =>
        activeSubjectId ? s.subject?.id === activeSubjectId : true
      );
      if (es?.examSubjectPartition && es.examSubjectPartition.length > 0) {
        return es.examSubjectPartition;
      }
    }
    return [];
  }, [students, activeSubjectId]);

  // Total max marks for the active subject
  const activeSubjectTotalMax = useMemo(() => {
    return activePartitions.reduce((sum, p) => sum + (Number(p.totalMarks) || 0), 0);
  }, [activePartitions]);

  // Summary counts
  const summaryCounts = useMemo(() => {
    let graded = 0;
    let absent = 0;
    let passCount = 0;
    let failCount = 0;
    let totalFields = 0;

    Object.values(marksState).forEach((item) => {
      totalFields++;
      if (item.isAbsent) {
        absent++;
      } else if (item.mark !== '') {
        graded++;
        const val = parseFloat(item.mark);
        const min = item.minMark ?? 35;
        if (!isNaN(val)) {
          if (val >= min) {
            passCount++;
          } else {
            failCount++;
          }
        }
      }
    });

    return { graded, absent, passCount, failCount, totalFields };
  }, [marksState]);

  // Helper: compute total for a student row in current subject
  const computeRowTotal = (studentId: string, partitions: AssessmentPartition[]) => {
    let sum = 0;
    let hasAnyMark = false;
    let allAbsent = partitions.length > 0;
    let hasAnyFail = false;
    let allFilled = partitions.length > 0;

    for (const p of partitions) {
      const key = `${studentId}_${p.id}`;
      const state = marksState[key];
      const pMin =
        Number(p.minMark) > 0
          ? Number(p.minMark)
          : Math.round(Number(p.totalMarks || 100) * 0.35);

      if (!state?.isAbsent) {
        allAbsent = false;
      }
      if (state?.mark !== '' && state?.mark !== undefined && !state?.isAbsent) {
        const val = parseFloat(state.mark) || 0;
        sum += val;
        hasAnyMark = true;
        if (val < pMin) {
          hasAnyFail = true;
        }
      } else if (!state?.isAbsent) {
        allFilled = false;
      }
    }

    if (allAbsent) {
      return { isAllAbsent: true, status: 'absent' as const, display: 'ABS' };
    }
    if (!hasAnyMark) {
      return { isAllAbsent: false, status: 'empty' as const, display: '-' };
    }
    const formatted = sum % 1 === 0 ? String(sum) : sum.toFixed(1);
    const status: 'pass' | 'fail' | 'neutral' = hasAnyFail
      ? 'fail'
      : allFilled
        ? 'pass'
        : 'neutral';
    return { isAllAbsent: false, status, display: formatted };
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* App Header */}
      <Header
        title="Exam Mark Entry"
        subtitle="Grade student assessments & partitions"
        showSearch={false}
      />

      <OfflineStatusBar />

      {/* Filter Summary Strip */}
      <View style={styles.filterBarWrapper}>
        <TouchableOpacity
          style={styles.filterBarCard}
          onPress={() => setIsFilterModalOpen(true)}
          activeOpacity={0.8}
        >
          <View style={styles.filterBarLeft}>
            <View style={styles.filterIconCircle}>
              <Filter size={15} color="#6559FC" />
            </View>
            <View style={styles.filterBarTextCol}>
              {filters ? (
                <>
                  <Text style={styles.filterBarMainText} numberOfLines={1}>
                    {filters.className} ({filters.sectionName}) • {filters.examName}
                  </Text>
                  <Text style={styles.filterBarSubText} numberOfLines={1}>
                    {filters.subjectName
                      ? `Subject: ${filters.subjectName}`
                      : filters.isClassIncharge
                        ? '👑 Class Incharge • All Subjects'
                        : 'Assigned Subjects'}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.filterBarPlaceholderText}>Select Class, Section & Exam</Text>
                  <Text style={styles.filterBarSubText}>Tap to choose options and load students</Text>
                </>
              )}
            </View>
          </View>
          <View style={styles.changeFilterPill}>
            <Text style={styles.changeFilterPillText}>{filters ? 'Change' : 'Filter'}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Online/Offline Notice Banner */}
      {bannerNotice && (
        <View style={[styles.noticeBanner, bannerNotice.isOffline && styles.noticeBannerOffline]}>
          <CheckCircle2 size={16} color={bannerNotice.isOffline ? '#D97706' : '#059669'} />
          <Text style={[styles.noticeBannerText, bannerNotice.isOffline && styles.noticeBannerTextOffline]}>
            {bannerNotice.text}
          </Text>
        </View>
      )}

      {/* Permission Warning Banner */}
      {permissions && !permissions.canEnterMarks && (
        <View style={styles.permissionWarningBox}>
          <AlertCircle size={16} color="#DC2626" />
          <Text style={styles.permissionWarningText}>
            {permissions.message || 'Mark entry is currently closed for this exam.'}
          </Text>
        </View>
      )}

      {/* Subject Tabs Bar (Excel Workbook Sheets style when multiple subjects available) */}
      {students.length > 0 && availableSubjects.length > 1 && (
        <View style={styles.sheetTabBarContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sheetTabBarContent}
          >
            {availableSubjects.map((sub) => {
              const isActive = sub.id === activeSubjectId;
              return (
                <TouchableOpacity
                  key={sub.id}
                  style={[styles.sheetTab, isActive && styles.sheetTabActive]}
                  onPress={() => {
                    try {
                      Haptics.selectionAsync();
                    } catch { }
                    setActiveSubjectId(sub.id);
                  }}
                  activeOpacity={0.7}
                >
                  <BookOpen
                    size={13}
                    color={isActive ? '#FFFFFF' : '#64748B'}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={[styles.sheetTabText, isActive && styles.sheetTabTextActive]}>
                    {sub.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Search Bar */}
      {students.length > 0 && (
        <View style={styles.searchBarRow}>
          <Search size={16} color="#94A3B8" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search student by name or roll number..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearSearchText}>Clear</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      )}

      {/* Pass / Fail Legend & Live Stats Strip */}
      {students.length > 0 && (
        <View style={styles.statusLegendRow}>
          <View style={styles.legendGroup}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#16A34A' }]} />
              <Text style={styles.legendText}>Pass (≥Min)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#DC2626' }]} />
              <Text style={styles.legendText}>Fail (&lt;Min)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#991B1B' }]} />
              <Text style={styles.legendText}>Absent [A]</Text>
            </View>
          </View>
          <Text style={styles.legendSummaryBadge}>
            {summaryCounts.passCount} P • {summaryCounts.failCount} F
          </Text>
        </View>
      )}

      {/* Main Content View */}
      {isLoading && !isRefreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#6559FC" />
          <Text style={styles.loadingText}>Loading student spreadsheet...</Text>
        </View>
      ) : !filters ? (
        /* Empty State: No Filters Chosen */
        <View style={styles.centerContainer}>
          <View style={styles.emptyIconCircle}>
            <SlidersHorizontal size={36} color="#6559FC" />
          </View>
          <Text style={styles.emptyTitle}>No Exam Filters Selected</Text>
          <Text style={styles.emptySubtitle}>
            Please select the Class, Section, and Exam to load the student mark entry spreadsheet.
          </Text>
          <TouchableOpacity style={styles.selectFilterCtaBtn} onPress={() => setIsFilterModalOpen(true)}>
            <Filter size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.selectFilterCtaBtnText}>Select Filters</Text>
          </TouchableOpacity>
        </View>
      ) : students.length === 0 ? (
        /* Empty State: Filters selected but 0 students found */
        <View style={styles.centerContainer}>
          <View style={[styles.emptyIconCircle, { backgroundColor: '#F1F5F9' }]}>
            <UserX size={36} color="#94A3B8" />
          </View>
          <Text style={styles.emptyTitle}>No Students Found</Text>
          <Text style={styles.emptySubtitle}>
            No students are currently mapped to Class {filters.className} - {filters.sectionName} for this exam.
          </Text>
          <TouchableOpacity
            style={[styles.selectFilterCtaBtn, { backgroundColor: '#E2E8F0' }]}
            onPress={() => setIsFilterModalOpen(true)}
          >
            <Text style={[styles.selectFilterCtaBtnText, { color: '#334155' }]}>Try Another Class / Exam</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* EXCEL SPREADSHEET TABLE */
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            style={styles.spreadsheetVerticalScroll}
            contentContainerStyle={styles.spreadsheetVerticalContent}
            showsVerticalScrollIndicator={true}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={() => filters && fetchMarkEntries(filters, true)}
                colors={['#6559FC']}
                tintColor="#6559FC"
              />
            }
          >
            <View style={styles.spreadsheetCard}>
              <View style={styles.spreadsheetRowFlex}>
                {/* 1. FROZEN LEFT COLUMN: Student Full Name */}
                <View style={styles.frozenColumn}>
                  {/* Top-Left Header Cell */}
                  <View style={styles.frozenHeaderCell}>
                    <Text style={styles.frozenHeaderTitle}>Name</Text>
                  </View>

                  {/* Student Rows */}
                  {filteredStudents.map((student, index) => {
                    const fullName = `${student.firstName} ${student.lastName || ''}`.trim();
                    return (
                      <View
                        key={student.id}
                        style={[styles.frozenStudentCell, index % 2 === 1 && styles.rowZebra]}
                      >
                        <Text style={styles.studentNameText} numberOfLines={2}>
                          {fullName}
                        </Text>
                      </View>
                    );
                  })}
                </View>

                {/* 2. HORIZONTALLY SCROLLABLE COLUMNS: Assessment Formats in Order */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={true}
                  style={styles.horizontalScroll}
                >
                  <View>
                    {/* Header Row */}
                    <View style={styles.formatHeaderRow}>
                      {activePartitions.map((part) => {
                        const pMin =
                          Number(part.minMark) > 0
                            ? Number(part.minMark)
                            : Math.round(Number(part.totalMarks || 100) * 0.35);
                        return (
                          <View key={part.id} style={styles.formatHeaderCell}>
                            <Text style={styles.formatHeaderName} numberOfLines={1}>
                              {part.assessmentFormat?.name || 'Format'}
                            </Text>
                            <Text style={styles.formatHeaderMax}>
                              /{part.totalMarks} {pMin > 0 ? `(≥${pMin})` : ''}
                            </Text>
                          </View>
                        );
                      })}

                      {/* Total Column Header */}
                      <View style={styles.totalHeaderCell}>
                        <Text style={styles.totalHeaderName}>Total</Text>
                        <Text style={styles.totalHeaderMax}>Max: {activeSubjectTotalMax}</Text>
                      </View>
                    </View>

                    {/* Data Rows for Each Student */}
                    {filteredStudents.map((student, index) => {
                      const studentSubject = student.examSubjects?.find((s) =>
                        activeSubjectId ? s.subject?.id === activeSubjectId : true
                      );
                      const partitions = studentSubject?.examSubjectPartition || activePartitions;
                      const rowStats = computeRowTotal(student.id, partitions);

                      return (
                        <View
                          key={student.id}
                          style={[styles.formatDataRow, index % 2 === 1 && styles.rowZebra]}
                        >
                          {partitions.map((partition) => {
                            const key = `${student.id}_${partition.id}`;
                            const current = marksState[key] || {
                              mark: '',
                              isAbsent: false,
                              maxMark: Number(partition.totalMarks || 100),
                              minMark:
                                Number(partition.minMark) > 0
                                  ? Number(partition.minMark)
                                  : Math.round(Number(partition.totalMarks || 100) * 0.35),
                            };
                            const isAbsent = current.isAbsent;
                            const isReadOnly = permissions ? !permissions.canEnterMarks : false;

                            const pMin =
                              Number(partition.minMark) > 0
                                ? Number(partition.minMark)
                                : Math.round(Number(partition.totalMarks || 100) * 0.35);

                            const markVal = parseFloat(current.mark);
                            const isFilled = current.mark !== '' && !isNaN(markVal);
                            const isPass = !isAbsent && isFilled && markVal >= pMin;
                            const isFail = !isAbsent && isFilled && markVal < pMin;

                            return (
                              <View
                                key={partition.id}
                                style={[
                                  styles.cellWrapper,
                                  isAbsent && styles.cellWrapperAbsent,
                                  isPass && styles.cellWrapperPass,
                                  isFail && styles.cellWrapperFail,
                                ]}
                              >
                                <TextInput
                                  style={[
                                    styles.cellInput,
                                    isAbsent && styles.cellInputAbsent,
                                    isPass && styles.cellInputPass,
                                    isFail && styles.cellInputFail,
                                    isReadOnly && styles.cellInputDisabled,
                                  ]}
                                  value={isAbsent ? 'ABS' : current.mark}
                                  onChangeText={(val) => handleMarkChange(student.id, partition, val)}
                                  keyboardType="number-pad"
                                  placeholder="-"
                                  placeholderTextColor="#94A3B8"
                                  editable={!isAbsent && !isReadOnly}
                                  maxLength={3}
                                />

                                {!isReadOnly && (
                                  <TouchableOpacity
                                    style={[
                                      styles.absentToggleBtn,
                                      isAbsent && styles.absentToggleBtnActive,
                                    ]}
                                    onPress={() => handleToggleAbsent(student.id, partition)}
                                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                                  >
                                    <Text
                                      style={[
                                        styles.absentToggleBtnText,
                                        isAbsent && styles.absentToggleBtnTextActive,
                                      ]}
                                    >
                                      A
                                    </Text>
                                  </TouchableOpacity>
                                )}
                              </View>
                            );
                          })}

                          {/* Total Column Cell */}
                          <View
                            style={[
                              styles.totalCell,
                              rowStats.status === 'pass' && styles.totalCellPass,
                              rowStats.status === 'fail' && styles.totalCellFail,
                              rowStats.status === 'absent' && styles.totalCellAbsent,
                            ]}
                          >
                            <Text
                              style={[
                                styles.totalCellText,
                                rowStats.isAllAbsent && styles.totalCellTextAbsent,
                                rowStats.status === 'pass' && styles.totalCellTextPass,
                                rowStats.status === 'fail' && styles.totalCellTextFail,
                              ]}
                            >
                              {rowStats.isAllAbsent ? 'ABS' : rowStats.display}
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>
            </View>

            <View style={{ height: 90 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      )}

      {/* Floating Save Action Bar */}
      {students.length > 0 && (
        <View style={styles.floatingFooter}>
          <View style={styles.footerStatsCol}>
            <Text style={styles.footerStatsText}>
              <Text style={{ fontWeight: '700', color: '#0F172A' }}>{students.length}</Text> Students
            </Text>
            <Text style={styles.footerSubStats}>
              {summaryCounts.graded} Graded ({summaryCounts.passCount} P • {summaryCounts.failCount} F) • {summaryCounts.absent} Absent
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.saveMarksBtn,
              (dirtyKeys.size === 0 || isSaving || Boolean(permissions && !permissions.canEnterMarks)) &&
              styles.saveMarksBtnDisabled,
            ]}
            onPress={handleSaveMarks}
            disabled={dirtyKeys.size === 0 || isSaving || Boolean(permissions && !permissions.canEnterMarks)}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Save size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.saveMarksBtnText}>
                  Save Marks {dirtyKeys.size > 0 ? `(${dirtyKeys.size})` : ''}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Step-by-Step Progressive Filter Modal Sheet */}
      <MarkEntryFilterModal
        visible={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
        initialClassId={filters?.classId}
        initialSectionId={filters?.sectionId}
        initialExamId={filters?.examId}
        initialSubjectId={filters?.subjectId}
        initialStaffId={filters?.staffId}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  filterBarWrapper: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
  },
  filterBarCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  filterBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  filterIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  filterBarTextCol: {
    flex: 1,
  },
  filterBarMainText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  filterBarPlaceholderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  filterBarSubText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  changeFilterPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  changeFilterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  noticeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    marginHorizontal: 16,
    marginTop: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    gap: 8,
  },
  noticeBannerOffline: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  noticeBannerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#065F46',
    flex: 1,
  },
  noticeBannerTextOffline: {
    color: '#92400E',
  },
  permissionWarningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    marginHorizontal: 16,
    marginTop: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
    gap: 8,
  },
  permissionWarningText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#991B1B',
    flex: 1,
  },
  sheetTabBarContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginTop: 6,
  },
  sheetTabBarContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  sheetTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sheetTabActive: {
    backgroundColor: '#6559FC',
    borderColor: '#6559FC',
  },
  sheetTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  sheetTabTextActive: {
    color: '#FFFFFF',
  },
  searchBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    padding: 0,
  },
  clearSearchText: {
    fontSize: 12,
    color: '#6559FC',
    fontWeight: '600',
    marginLeft: 6,
  },
  statusLegendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 2,
    marginBottom: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  legendGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  legendText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  legendSummaryBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#334155',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 12,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  selectFilterCtaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6559FC',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  selectFilterCtaBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  /* EXCEL SPREADSHEET STYLES */
  spreadsheetVerticalScroll: {
    flex: 1,
    paddingHorizontal: 4,
    paddingTop: 4,
  },
  spreadsheetVerticalContent: {
    paddingBottom: 24,
  },
  spreadsheetCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  spreadsheetRowFlex: {
    flexDirection: 'row',
  },

  /* 1. Frozen Column */
  frozenColumn: {
    width: 105,
    borderRightWidth: 1.5,
    borderRightColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    zIndex: 10,
  },
  frozenHeaderCell: {
    height: 36,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    paddingHorizontal: 6,
    borderBottomWidth: 1.5,
    borderBottomColor: '#CBD5E1',
  },
  frozenHeaderTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  frozenStudentCell: {
    height: 36,
    justifyContent: 'center',
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  studentNameText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#1E293B',
    lineHeight: 13,
  },

  /* 2. Scrollable Columns */
  horizontalScroll: {
    flex: 1,
  },
  formatHeaderRow: {
    flexDirection: 'row',
    height: 36,
    backgroundColor: '#F1F5F9',
    borderBottomWidth: 1.5,
    borderBottomColor: '#CBD5E1',
  },
  formatHeaderCell: {
    width: 76,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 1,
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
  },
  formatHeaderName: {
    fontSize: 10,
    fontWeight: '700',
    color: '#334155',
    textAlign: 'center',
  },
  formatHeaderMax: {
    fontSize: 8.5,
    fontWeight: '600',
    color: '#64748B',
  },
  totalHeaderCell: {
    width: 48,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E2E8F0',
    borderRightWidth: 1,
    borderRightColor: '#CBD5E1',
  },
  totalHeaderName: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1E293B',
  },
  totalHeaderMax: {
    fontSize: 8.5,
    fontWeight: '600',
    color: '#475569',
  },

  /* Data Rows */
  formatDataRow: {
    flexDirection: 'row',
    height: 36,
  },
  rowZebra: {
    backgroundColor: '#F8FAFC',
  },
  cellWrapper: {
    width: 76,
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 1,
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 2,
  },
  cellWrapperAbsent: {
    backgroundColor: '#FEF2F2',
  },
  cellWrapperPass: {
    backgroundColor: '#F0FDF4',
  },
  cellWrapperFail: {
    backgroundColor: '#FEF2F2',
  },
  cellInput: {
    width: 58,
    height: 26,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 3,
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '700',
    color: '#0F172A',
    padding: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  cellInputPass: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
    color: '#15803D',
    fontWeight: '700',
  },
  cellInputFail: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
    color: '#B91C1C',
    fontWeight: '700',
  },
  cellInputAbsent: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
    color: '#DC2626',
    fontWeight: '700',
  },
  cellInputDisabled: {
    backgroundColor: '#F1F5F9',
    color: '#94A3B8',
  },
  absentToggleBtn: {
    width: 17,
    height: 22,
    borderRadius: 3,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  absentToggleBtnActive: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  absentToggleBtnText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#475569',
  },
  absentToggleBtnTextActive: {
    color: '#FFFFFF',
  },

  /* Total Cell */
  totalCell: {
    width: 48,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRightWidth: 1,
    borderRightColor: '#CBD5E1',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  totalCellPass: {
    backgroundColor: '#F0FDF4',
  },
  totalCellFail: {
    backgroundColor: '#FEF2F2',
  },
  totalCellAbsent: {
    backgroundColor: '#FEF2F2',
  },
  totalCellText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  totalCellTextPass: {
    color: '#15803D',
  },
  totalCellTextFail: {
    color: '#B91C1C',
  },
  totalCellTextAbsent: {
    color: '#DC2626',
  },

  /* Floating Save Footer */
  floatingFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 8,
  },
  footerStatsCol: {
    flex: 1,
  },
  footerStatsText: {
    fontSize: 13,
    color: '#475569',
  },
  footerSubStats: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  saveMarksBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6559FC',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
  },
  saveMarksBtnDisabled: {
    backgroundColor: '#CBD5E1',
  },
  saveMarksBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
