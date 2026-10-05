import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  AlertCircle,
  ArrowLeft,
  Award,
  CheckCircle2,
  ChevronDown,
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  GraduationCap,
  RefreshCw,
  Search,
  Sparkles,
  User,
  Users,
  X,
} from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
import {
  StudentMarklistFilterModal,
  StudentMarklistFilterResult,
} from '../../src/components/StudentMarklistFilterModal';
import { useAuth } from '../../src/context/auth';
import { api } from '../../src/lib/api';
import {
  exportStudentMarkListToExcel,
  exportStudentMarkListToPDF,
  StudentMarkItem,
} from '../../src/utils/staffAnalyticsExport';

interface SubjectHeader {
  id: string;
  name: string;
  partitions: string[];
}

interface MarklistApiResponse {
  success: boolean;
  exam: { id: string; name: string };
  class: { id: string; name: string } | null;
  section: { id: string; name: string } | null;
  studentMarkList: StudentMarkItem[];
  subjectHeaders: SubjectHeader[];
  isSectionIncharge?: boolean;
}

export default function StudentMarklistScreen() {
  const router = useRouter();
  const { user } = useAuth();

  // Filters state - STRICTLY undefined by default
  const [filters, setFilters] = useState<StudentMarklistFilterResult | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Data states
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [data, setData] = useState<MarklistApiResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Search & Filter Status
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [studentFilterStatus, setStudentFilterStatus] = useState<'all' | 'pass' | 'fail' | 'absent'>('all');

  // Sorting state
  const [sortField, setSortField] = useState<'index' | 'name' | 'total' | 'rank'>('index');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Export states
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);

  // User-scoped cache key
  const cacheKey = useMemo(() => {
    if (!user?.id || !filters?.examId) return null;
    return `@rexdeia_student_marklist_${user.id}_${filters.examId}_${filters.classId}_${filters.sectionId}`;
  }, [user?.id, filters]);

  // Reset state when user changes or logs out (Rule 2)
  useEffect(() => {
    setFilters(null);
    setData(null);
    setErrorMessage(null);
  }, [user?.id]);

  // Fetch marklist data from backend
  const fetchMarklist = useCallback(
    async (appliedFilters: StudentMarklistFilterResult, isPullRefresh = false) => {
      if (!appliedFilters.examId) return;

      if (isPullRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setErrorMessage(null);

      try {
        const queryParams = new URLSearchParams({
          examId: appliedFilters.examId,
          ...(appliedFilters.classId ? { classId: appliedFilters.classId } : {}),
          ...(appliedFilters.sectionId ? { sectionId: appliedFilters.sectionId } : {}),
        }).toString();

        const res = await api.get<MarklistApiResponse>(
          `/api/mobile/v1/analytics/staff-analysis?${queryParams}`
        );

        if (res && res.success) {
          setData(res);
          // Persist to user-scoped cache
          if (cacheKey) {
            await AsyncStorage.setItem(cacheKey, JSON.stringify(res)).catch(() => {});
          }
        } else {
          setErrorMessage('Unable to load marklist data.');
        }
      } catch (err: any) {
        const msg = err?.data?.message || err?.message || 'Failed to fetch student marklist.';
        setErrorMessage(msg);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [cacheKey]
  );

  // Trigger fetch when filters are applied
  useEffect(() => {
    if (filters?.examId) {
      fetchMarklist(filters);
    }
  }, [filters]);

  const handleApplyFilters = (newFilters: StudentMarklistFilterResult) => {
    setFilters(newFilters);
  };

  const rawStudentList = data?.studentMarkList || [];
  const subjectHeaders = data?.subjectHeaders || [];

  const studentsWithIndex = useMemo(() => {
    return rawStudentList.map((s, idx) => ({
      ...s,
      originalIndex: idx + 1,
    }));
  }, [rawStudentList]);

  // KPI stats
  const studentStats = useMemo(() => {
    const total = rawStudentList.length;
    const passed = rawStudentList.filter((s) => s.isPass).length;
    const failed = rawStudentList.filter((s) => !s.isPass && !s.isAbsent).length;
    const absent = rawStudentList.filter((s) => s.isAbsent).length;
    const passRate = total > 0 ? Number(((passed / total) * 100).toFixed(1)) : 0;
    return { total, passed, failed, absent, passRate };
  }, [rawStudentList]);

  // Filtered students by status and search
  const filteredStudents = useMemo(() => {
    return studentsWithIndex.filter((student) => {
      if (studentFilterStatus === 'pass' && !student.isPass) return false;
      if (studentFilterStatus === 'fail' && (student.isPass || student.isAbsent)) return false;
      if (studentFilterStatus === 'absent' && !student.isAbsent) return false;

      if (studentSearchQuery.trim()) {
        const query = studentSearchQuery.toLowerCase().trim();
        const matchesName = student.name.toLowerCase().includes(query);
        const matchesSection = student.sectionName.toLowerCase().includes(query);
        const matchesClass = student.className.toLowerCase().includes(query);
        return matchesName || matchesSection || matchesClass;
      }
      return true;
    });
  }, [studentsWithIndex, studentFilterStatus, studentSearchQuery]);

  // Multi-column sorting
  const sortedStudents = useMemo(() => {
    const list = [...filteredStudents];
    list.sort((a, b) => {
      if (sortField === 'index') {
        const idxA = Number(a.originalIndex) || 0;
        const idxB = Number(b.originalIndex) || 0;
        return sortDirection === 'asc' ? idxA - idxB : idxB - idxA;
      }
      if (sortField === 'name') {
        const nameA = String(a.name || '');
        const nameB = String(b.name || '');
        return sortDirection === 'asc'
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      }
      if (sortField === 'total') {
        const tA = Number(a.totalMark) || 0;
        const tB = Number(b.totalMark) || 0;
        return sortDirection === 'asc' ? tA - tB : tB - tA;
      }
      if (sortField === 'rank') {
        const rA = a.rank ?? 999999;
        const rB = b.rank ?? 999999;
        return sortDirection === 'asc' ? rA - rB : rB - rA;
      }
      return 0;
    });
    return list;
  }, [filteredStudents, sortField, sortDirection]);

  const handleToggleSort = (field: 'index' | 'name' | 'total' | 'rank') => {
    try {
      Haptics.selectionAsync();
    } catch {}
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection(field === 'rank' ? 'asc' : field === 'total' ? 'desc' : 'asc');
    }
  };

  // Export handlers
  const handleExportPDF = async () => {
    if (!filters || sortedStudents.length === 0) {
      Alert.alert('No Data', 'No students available to export.');
      return;
    }
    try {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch {}
      setIsExportingPDF(true);
      await exportStudentMarkListToPDF({
        examName: filters.examName,
        className: filters.className,
        sectionName: filters.sectionName,
        students: sortedStudents,
      });
    } catch (err: any) {
      Alert.alert('Export Error', err?.message || 'Failed to export PDF.');
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleExportExcel = async () => {
    if (!filters || sortedStudents.length === 0) {
      Alert.alert('No Data', 'No students available to export.');
      return;
    }
    try {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch {}
      setIsExportingExcel(true);
      await exportStudentMarkListToExcel({
        examName: filters.examName,
        className: filters.className,
        sectionName: filters.sectionName,
        students: sortedStudents,
      });
    } catch (err: any) {
      Alert.alert('Export Error', err?.message || 'Failed to export Excel.');
    } finally {
      setIsExportingExcel(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Screen Top Header Bar */}
      <View style={styles.topHeader}>
        <View style={styles.topHeaderLeft}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/(tabs)/analytics');
              }
            }}
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color="#0F172A" />
          </TouchableOpacity>
          <View>
            <Text style={styles.screenTitle}>Student Marklist</Text>
            <Text style={styles.screenSubtitle}>
              {filters ? `${filters.className} • ${filters.sectionName}` : 'Detailed Marksheet & Rankings'}
            </Text>
          </View>
        </View>

        {/* Filter Trigger Button */}
        <TouchableOpacity
          style={[styles.filterTriggerBtn, !filters && styles.filterTriggerBtnPrompt]}
          onPress={() => setIsFilterModalOpen(true)}
          activeOpacity={0.8}
        >
          <Filter size={16} color={filters ? '#6559FC' : '#FFFFFF'} style={{ marginRight: 6 }} />
          <Text style={[styles.filterTriggerText, !filters && styles.filterTriggerTextPrompt]}>
            {filters ? 'Change' : 'Choose Filters'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Active Filter Pill Bar (when filters are chosen) */}
      {filters && (
        <View style={styles.activeFilterStrip}>
          <View style={styles.activeFilterPill}>
            <Award size={13} color="#6559FC" style={{ marginRight: 6 }} />
            <Text style={styles.activeFilterPillText} numberOfLines={1}>
              {filters.examName}
            </Text>
          </View>

          <View style={styles.activeFilterPill}>
            <GraduationCap size={13} color="#16A34A" style={{ marginRight: 6 }} />
            <Text style={styles.activeFilterPillText} numberOfLines={1}>
              {filters.className} - {filters.sectionName}
            </Text>
          </View>
        </View>
      )}

      {/* BODY CONTENT */}
      {!filters ? (
        /* PROMPT STATE: Prompt user to choose class, section, and exam */
        <ScrollView
          style={styles.contentScroll}
          contentContainerStyle={styles.promptScrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.promptHeroCard}>
            <View style={styles.promptIconWrap}>
              <FileSpreadsheet size={42} color="#6559FC" />
            </View>
            <Text style={styles.promptTitle}>Select Marklist Criteria</Text>
            <Text style={styles.promptSubtitle}>
              Please select your class, section, and configured exam to load the student marksheet and class ranks.
            </Text>

            {/* 3 Step Visual Indicators */}
            <View style={styles.stepVisualBox}>
              <View style={styles.stepRowItem}>
                <View style={[styles.stepNumBadge, { backgroundColor: '#F0FDF4' }]}>
                  <Text style={[styles.stepNumText, { color: '#16A34A' }]}>1</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.stepRowTitle}>Select Class</Text>
                  <Text style={styles.stepRowSub}>Choose your assigned class or overall</Text>
                </View>
              </View>

              <View style={styles.stepRowDivider} />

              <View style={styles.stepRowItem}>
                <View style={[styles.stepNumBadge, { backgroundColor: '#FFFBEB' }]}>
                  <Text style={[styles.stepNumText, { color: '#D97706' }]}>2</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.stepRowTitle}>Select Section</Text>
                  <Text style={styles.stepRowSub}>Choose section belonging to selected class</Text>
                </View>
              </View>

              <View style={styles.stepRowDivider} />

              <View style={styles.stepRowItem}>
                <View style={[styles.stepNumBadge, { backgroundColor: '#EEF2FF' }]}>
                  <Text style={[styles.stepNumText, { color: '#6559FC' }]}>3</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.stepRowTitle}>Select Exam</Text>
                  <Text style={styles.stepRowSub}>Populated for the selected section</Text>
                </View>
              </View>
            </View>

            {/* Big Action Button */}
            <TouchableOpacity
              style={styles.promptActionBtn}
              onPress={() => setIsFilterModalOpen(true)}
              activeOpacity={0.85}
            >
              <Filter size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.promptActionBtnText}>Choose Class, Section & Exam</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : isLoading ? (
        /* LOADING STATE (Rule 1) */
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#6559FC" />
          <Text style={styles.loadingMessage}>Loading student mark list...</Text>
          <Text style={styles.loadingSubMessage}>Fetching subject scores and rankings</Text>
        </View>
      ) : errorMessage ? (
        /* ERROR STATE */
        <View style={styles.centerContainer}>
          <View style={styles.errorIconWrap}>
            <AlertCircle size={36} color="#DC2626" />
          </View>
          <Text style={styles.errorTitle}>Error Loading Marklist</Text>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => filters && fetchMarklist(filters)}
          >
            <RefreshCw size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.retryBtnText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* LOADED MARKLIST VIEW */
        <ScrollView
          style={styles.contentScroll}
          contentContainerStyle={styles.contentScrollContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => filters && fetchMarklist(filters, true)}
              tintColor="#6559FC"
              colors={['#6559FC']}
            />
          }
        >
          {/* Executive Overview KPI Grid */}
          <View style={styles.kpiContainer}>
            <View style={styles.kpiHeaderRow}>
              <Text style={styles.kpiHeaderTitle}>Performance Overview</Text>
              <View style={styles.overallBadge}>
                <GraduationCap size={12} color="#6559FC" style={{ marginRight: 4 }} />
                <Text style={styles.overallBadgeText}>{filters.sectionName || filters.className}</Text>
              </View>
            </View>

            <View style={styles.kpiGrid}>
              {/* Total Students */}
              <View style={styles.kpiCard}>
                <View style={[styles.kpiIconWrap, { backgroundColor: '#EEF2FF' }]}>
                  <Users size={16} color="#6559FC" />
                </View>
                <Text style={styles.kpiValue}>{studentStats.total}</Text>
                <Text style={styles.kpiLabel}>Total Students</Text>
              </View>

              {/* Passed */}
              <View style={styles.kpiCard}>
                <View style={[styles.kpiIconWrap, { backgroundColor: '#DCFCE7' }]}>
                  <CheckCircle2 size={16} color="#15803D" />
                </View>
                <Text style={[styles.kpiValue, { color: '#15803D' }]}>{studentStats.passed}</Text>
                <Text style={styles.kpiLabel}>Passed ({studentStats.passRate}%)</Text>
              </View>

              {/* Failed */}
              <View style={styles.kpiCard}>
                <View style={[styles.kpiIconWrap, { backgroundColor: '#FEE2E2' }]}>
                  <AlertCircle size={16} color="#DC2626" />
                </View>
                <Text style={[styles.kpiValue, { color: '#DC2626' }]}>{studentStats.failed}</Text>
                <Text style={styles.kpiLabel}>Failed</Text>
              </View>

              {/* Absent */}
              <View style={styles.kpiCard}>
                <View style={[styles.kpiIconWrap, { backgroundColor: '#F1F5F9' }]}>
                  <User size={16} color="#64748B" />
                </View>
                <Text style={styles.kpiValue}>{studentStats.absent}</Text>
                <Text style={styles.kpiLabel}>Absent</Text>
              </View>
            </View>
          </View>

          {/* Quick Action Export Bar */}
          {rawStudentList.length > 0 && (
            <View style={styles.exportBar}>
              <Text style={styles.exportBarTitle}>Download Marklist Reports:</Text>
              <View style={styles.exportActionsRow}>
                {/* PDF Export */}
                <TouchableOpacity
                  style={[styles.exportBtn, styles.exportBtnPdf]}
                  onPress={handleExportPDF}
                  disabled={isExportingPDF}
                  activeOpacity={0.8}
                >
                  {isExportingPDF ? (
                    <ActivityIndicator size="small" color="#DC2626" />
                  ) : (
                    <>
                      <FileText size={15} color="#DC2626" style={{ marginRight: 6 }} />
                      <Text style={styles.exportBtnTextPdf}>PDF Report</Text>
                    </>
                  )}
                </TouchableOpacity>

                {/* Excel Export */}
                <TouchableOpacity
                  style={[styles.exportBtn, styles.exportBtnExcel]}
                  onPress={handleExportExcel}
                  disabled={isExportingExcel}
                  activeOpacity={0.8}
                >
                  {isExportingExcel ? (
                    <ActivityIndicator size="small" color="#15803D" />
                  ) : (
                    <>
                      <FileSpreadsheet size={15} color="#15803D" style={{ marginRight: 6 }} />
                      <Text style={styles.exportBtnTextExcel}>Excel Sheet</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Search Bar */}
          <View style={styles.searchBarCard}>
            <Search size={16} color="#94A3B8" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search student name or section..."
              placeholderTextColor="#94A3B8"
              value={studentSearchQuery}
              onChangeText={setStudentSearchQuery}
            />
            {studentSearchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setStudentSearchQuery('')} style={styles.searchClearBtn}>
                <X size={14} color="#64748B" />
              </TouchableOpacity>
            )}
          </View>

          {/* Filter Status Chips */}
          <View style={styles.filterChipsRow}>
            <TouchableOpacity
              style={[styles.filterChip, studentFilterStatus === 'all' && styles.filterChipActive]}
              onPress={() => setStudentFilterStatus('all')}
            >
              <Text style={[styles.filterChipText, studentFilterStatus === 'all' && styles.filterChipTextActive]}>
                All ({studentStats.total})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterChip, studentFilterStatus === 'pass' && styles.filterChipActivePass]}
              onPress={() => setStudentFilterStatus('pass')}
            >
              <Text style={[styles.filterChipText, studentFilterStatus === 'pass' && styles.filterChipTextActivePass]}>
                Passed ({studentStats.passed})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterChip, studentFilterStatus === 'fail' && styles.filterChipActiveFail]}
              onPress={() => setStudentFilterStatus('fail')}
            >
              <Text style={[styles.filterChipText, studentFilterStatus === 'fail' && styles.filterChipTextActiveFail]}>
                Failed ({studentStats.failed})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterChip, studentFilterStatus === 'absent' && styles.filterChipActiveAbsent]}
              onPress={() => setStudentFilterStatus('absent')}
            >
              <Text style={[styles.filterChipText, studentFilterStatus === 'absent' && styles.filterChipTextActiveAbsent]}>
                Absent ({studentStats.absent})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Student Count & Swipe Hint */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeaderTitle}>
              Student Results ({sortedStudents.length} Students)
            </Text>
            <Text style={styles.swipeScrollHintText}>
              Swipe horizontally to view subjects ➔
            </Text>
          </View>

          {/* Students Table or Empty State (Rule 1) */}
          {sortedStudents.length === 0 ? (
            <View style={styles.studentEmptyBox}>
              <Users size={32} color="#94A3B8" />
              <Text style={styles.studentEmptyTitle}>No Data Available</Text>
              <Text style={styles.studentEmptySubtitle}>
                {rawStudentList.length === 0
                  ? 'No students found matching your selected exam, class, and section.'
                  : 'No students match your active search or status filters.'}
              </Text>
              <TouchableOpacity
                style={styles.resetFilterBtn}
                onPress={() => {
                  setStudentSearchQuery('');
                  setStudentFilterStatus('all');
                  if (rawStudentList.length === 0) {
                    setIsFilterModalOpen(true);
                  }
                }}
              >
                <Text style={styles.resetFilterBtnText}>
                  {rawStudentList.length === 0 ? 'Change Criteria' : 'Clear Filters'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.tableCardContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={true}
                nestedScrollEnabled={true}
                contentContainerStyle={styles.tableScrollContent}
              >
                <View style={styles.tableContentWrap}>
                  {/* Table Header Row */}
                  <View style={styles.tableHeaderRow}>
                    {/* Col # */}
                    <TouchableOpacity
                      style={[styles.thCell, styles.thColIndex]}
                      onPress={() => handleToggleSort('index')}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.thText}>#</Text>
                      <Text style={styles.sortIndicatorText}>
                        {sortField === 'index' ? (sortDirection === 'asc' ? ' ↑' : ' ↓') : ' ⇅'}
                      </Text>
                    </TouchableOpacity>

                    {/* Col Student Name */}
                    <TouchableOpacity
                      style={[styles.thCell, styles.thColName]}
                      onPress={() => handleToggleSort('name')}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.thText}>Student Name</Text>
                      <Text style={styles.sortIndicatorText}>
                        {sortField === 'name' ? (sortDirection === 'asc' ? ' ↑' : ' ↓') : ' ⇅'}
                      </Text>
                    </TouchableOpacity>

                    {/* Dynamic Subject Columns */}
                    {(subjectHeaders || []).map((subHeader) => {
                      const partitions = Array.isArray(subHeader.partitions) ? subHeader.partitions : [];
                      return (
                        <View key={subHeader.id} style={[styles.thCell, styles.thColSubject]}>
                          <Text style={styles.thSubjectTitle} numberOfLines={1}>
                            {subHeader.name}
                          </Text>
                          <View style={styles.thSubjectPartitionsRow}>
                            {partitions.map((partName, pIdx) => (
                              <Text key={pIdx} style={styles.thPartitionName} numberOfLines={1}>
                                {partName}
                              </Text>
                            ))}
                            <Text style={[styles.thPartitionName, styles.thTotName]}>Tot</Text>
                          </View>
                        </View>
                      );
                    })}

                    {/* Col Total */}
                    <TouchableOpacity
                      style={[styles.thCell, styles.thColTotal]}
                      onPress={() => handleToggleSort('total')}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.thText}>Total</Text>
                      <Text style={styles.sortIndicatorText}>
                        {sortField === 'total' ? (sortDirection === 'asc' ? ' ↑' : ' ↓') : ' ⇅'}
                      </Text>
                    </TouchableOpacity>

                    {/* Col Rank */}
                    <TouchableOpacity
                      style={[styles.thCell, styles.thColRank]}
                      onPress={() => handleToggleSort('rank')}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.thText}>Rank</Text>
                      <Text style={styles.sortIndicatorText}>
                        {sortField === 'rank' ? (sortDirection === 'asc' ? ' ↑' : ' ↓') : ' ⇅'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Virtualized Table Data Rows */}
                  <FlatList
                    data={sortedStudents}
                    keyExtractor={(item) => item.id}
                    initialNumToRender={15}
                    maxToRenderPerBatch={10}
                    windowSize={5}
                    removeClippedSubviews={Platform.OS === 'android'}
                    scrollEnabled={false}
                    renderItem={({ item: student, index: rowIdx }) => {
                      const studentSubjects = Array.isArray(student.subjects) ? student.subjects : [];
                      return (
                        <View
                          key={student.id}
                          style={[
                            styles.tableDataRow,
                            rowIdx % 2 === 1 ? styles.tableDataRowEven : null,
                          ]}
                        >
                          {/* Col # */}
                          <View style={[styles.tdCell, styles.tdColIndex]}>
                            <Text style={styles.tdIndexText}>{student.originalIndex}</Text>
                          </View>

                          {/* Col Student Name */}
                          <View style={[styles.tdCell, styles.tdColName]}>
                            <Text style={styles.tdStudentNameText} numberOfLines={1}>
                              {student.name || '-'}{' '}
                              <Text style={styles.tdSectionText}>({student.sectionName || '-'})</Text>
                            </Text>
                          </View>

                          {/* Dynamic Subject Cells */}
                          {(subjectHeaders || []).map((subHeader) => {
                            const studentSubject = studentSubjects.find(
                              (s) => s.subjectId === subHeader.id || s.subjectName === subHeader.name
                            );
                            const partitions = Array.isArray(subHeader.partitions) ? subHeader.partitions : [];
                            return (
                              <View key={subHeader.id} style={[styles.tdCell, styles.tdColSubject]}>
                                <View style={styles.tdSubjectContentRow}>
                                  {partitions.map((partName, pIdx) => {
                                    const studentPartitions = Array.isArray(studentSubject?.partitions)
                                      ? studentSubject.partitions
                                      : [];
                                    const partObj = studentPartitions.find(
                                      (p) => p.formatName === partName
                                    );
                                    const isAbsent = partObj?.isAbsent;
                                    const val = partObj?.mark;
                                    return (
                                      <Text
                                        key={pIdx}
                                        style={[
                                          styles.tdPartitionMark,
                                          isAbsent ? styles.tdAbsentText : null,
                                        ]}
                                      >
                                        {isAbsent ? 'A' : val !== undefined && val !== null ? val : '-'}
                                      </Text>
                                    );
                                  })}

                                  {/* Total & Grade */}
                                  {studentSubject && studentSubject.hasEntry ? (
                                    studentSubject.isAbsent ? (
                                      <Text style={[styles.tdSubTotText, styles.tdAbsentText]}>A</Text>
                                    ) : (
                                      <Text
                                        style={[
                                          styles.tdSubTotText,
                                          !studentSubject.isPass ? styles.tdFailText : null,
                                        ]}
                                      >
                                        {studentSubject.marks}
                                        {studentSubject.grade ? (
                                          <Text style={styles.tdGradeSuperText}>
                                            {' '}
                                            ({studentSubject.grade})
                                          </Text>
                                        ) : null}
                                        {studentSubject.centum ? ' ⭐' : ''}
                                      </Text>
                                    )
                                  ) : (
                                    <Text style={styles.tdPartitionMark}>-</Text>
                                  )}
                                </View>
                              </View>
                            );
                          })}

                          {/* Col Total */}
                          <View style={[styles.tdCell, styles.tdColTotal]}>
                            <Text
                              style={[
                                styles.tdTotalText,
                                !student.isPass && student.hasEntry ? styles.tdFailText : null,
                              ]}
                            >
                              {student.hasEntry ? student.totalMark : '-'}
                            </Text>
                            {student.percentage > 0 && (
                              <Text style={styles.tdPercentageText}>{student.percentage}%</Text>
                            )}
                          </View>

                          {/* Col Rank */}
                          <View style={[styles.tdCell, styles.tdColRank]}>
                            {student.rank !== null && student.rank !== undefined ? (
                              <View
                                style={[
                                  styles.rankBadge,
                                  student.rank === 1
                                    ? styles.rankGold
                                    : student.rank === 2
                                    ? styles.rankSilver
                                    : student.rank === 3
                                    ? styles.rankBronze
                                    : null,
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.rankBadgeText,
                                    student.rank <= 3 ? styles.rankTopBadgeText : null,
                                  ]}
                                >
                                  {student.rank === 1
                                    ? '🥇 1'
                                    : student.rank === 2
                                    ? '🥈 2'
                                    : student.rank === 3
                                    ? '🥉 3'
                                    : `#${student.rank}`}
                                </Text>
                              </View>
                            ) : (
                              <Text style={styles.tdRankDashText}>-</Text>
                            )}
                          </View>
                        </View>
                      );
                    }}
                  />
                </View>
              </ScrollView>
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      )}

      {/* Filter Modal Component */}
      <StudentMarklistFilterModal
        visible={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
        initialExamId={filters?.examId}
        initialClassId={filters?.classId}
        initialSectionId={filters?.sectionId}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  topHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  screenSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  filterTriggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  filterTriggerBtnPrompt: {
    backgroundColor: '#6559FC',
    borderColor: '#6559FC',
  },
  filterTriggerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6559FC',
  },
  filterTriggerTextPrompt: {
    color: '#FFFFFF',
  },
  activeFilterStrip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  activeFilterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeFilterPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  contentScroll: {
    flex: 1,
  },
  contentScrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  promptScrollContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80%',
  },
  promptHeroCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  promptIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  promptTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  promptSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 19,
    paddingHorizontal: 10,
  },
  stepVisualBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginTop: 20,
    padding: 14,
  },
  stepRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepNumBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    fontSize: 13,
    fontWeight: '800',
  },
  stepRowTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  stepRowSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  stepRowDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
    marginLeft: 40,
  },
  promptActionBtn: {
    width: '100%',
    backgroundColor: '#6559FC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 20,
    shadowColor: '#6559FC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 5,
  },
  promptActionBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingMessage: {
    marginTop: 14,
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  loadingSubMessage: {
    marginTop: 4,
    fontSize: 12,
    color: '#64748B',
  },
  errorIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  errorTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  errorMessage: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 16,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6559FC',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  kpiContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  kpiHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  kpiHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  overallBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  overallBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6559FC',
  },
  kpiGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  kpiIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  kpiValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  kpiLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
    textAlign: 'center',
  },
  exportBar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  exportBarTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  exportActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  exportBtnPdf: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  exportBtnTextPdf: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
  },
  exportBtnExcel: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  exportBtnTextExcel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  searchBarCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    padding: 0,
  },
  searchClearBtn: {
    padding: 4,
  },
  filterChipsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
  },
  filterChip: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  filterChipActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6559FC',
  },
  filterChipActivePass: {
    backgroundColor: '#DCFCE7',
    borderColor: '#16A34A',
  },
  filterChipActiveFail: {
    backgroundColor: '#FEE2E2',
    borderColor: '#DC2626',
  },
  filterChipActiveAbsent: {
    backgroundColor: '#F1F5F9',
    borderColor: '#64748B',
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  filterChipTextActive: {
    color: '#6559FC',
    fontWeight: '800',
  },
  filterChipTextActivePass: {
    color: '#16A34A',
    fontWeight: '800',
  },
  filterChipTextActiveFail: {
    color: '#DC2626',
    fontWeight: '800',
  },
  filterChipTextActiveAbsent: {
    color: '#475569',
    fontWeight: '800',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  swipeScrollHintText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6559FC',
  },
  studentEmptyBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  studentEmptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 10,
  },
  studentEmptySubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
  resetFilterBtn: {
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
  },
  resetFilterBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6559FC',
  },
  tableCardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  tableScrollContent: {
    paddingBottom: 6,
  },
  tableContentWrap: {
    flexDirection: 'column',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderBottomWidth: 2,
    borderBottomColor: '#CBD5E1',
  },
  thCell: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  thColIndex: {
    width: 44,
    justifyContent: 'center',
  },
  thColName: {
    width: 140,
    justifyContent: 'flex-start',
  },
  thColSubject: {
    width: 120,
    flexDirection: 'column',
    alignItems: 'center',
  },
  thColTotal: {
    width: 70,
    justifyContent: 'center',
  },
  thColRank: {
    width: 60,
    justifyContent: 'center',
    borderRightWidth: 0,
  },
  thText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#334155',
  },
  sortIndicatorText: {
    fontSize: 10,
    color: '#6559FC',
    fontWeight: '800',
  },
  thSubjectTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 4,
  },
  thSubjectPartitionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  thPartitionName: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
    textAlign: 'center',
    flex: 1,
  },
  thTotName: {
    color: '#6559FC',
    fontWeight: '800',
  },
  tableDataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tableDataRowEven: {
    backgroundColor: '#F8FAFC',
  },
  tdCell: {
    paddingVertical: 10,
    paddingHorizontal: 6,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#F1F5F9',
  },
  tdColIndex: {
    width: 44,
    alignItems: 'center',
  },
  tdIndexText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  tdColName: {
    width: 140,
  },
  tdStudentNameText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  tdSectionText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '500',
  },
  tdColSubject: {
    width: 120,
    alignItems: 'center',
  },
  tdSubjectContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },
  tdPartitionMark: {
    fontSize: 11,
    color: '#334155',
    textAlign: 'center',
    flex: 1,
  },
  tdSubTotText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    flex: 1,
  },
  tdGradeSuperText: {
    fontSize: 9,
    color: '#6559FC',
    fontWeight: '700',
  },
  tdAbsentText: {
    color: '#DC2626',
    fontWeight: '800',
  },
  tdFailText: {
    color: '#DC2626',
  },
  tdColTotal: {
    width: 70,
    alignItems: 'center',
  },
  tdTotalText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  tdPercentageText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 1,
  },
  tdColRank: {
    width: 60,
    alignItems: 'center',
    borderRightWidth: 0,
  },
  rankBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  rankGold: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  rankSilver: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  rankBronze: {
    backgroundColor: '#FFEDD5',
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  rankBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#334155',
  },
  rankTopBadgeText: {
    color: '#9A3412',
  },
  tdRankDashText: {
    fontSize: 12,
    color: '#94A3B8',
  },
});
