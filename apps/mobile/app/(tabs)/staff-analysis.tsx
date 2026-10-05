import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  AlertCircle,
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Crown,
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  GraduationCap,
  Layers,
  RefreshCw,
  Search,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Trophy,
  User,
  Users,
  X,
  XCircle,
} from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../src/components/Header';
import { OfflineStatusBar } from '../../src/components/OfflineStatusBar';
import {
  StaffAnalyticsFilterModal,
  StaffAnalyticsFilterResult,
} from '../../src/components/StaffAnalyticsFilterModal';
import { useAuth } from '../../src/context/auth';
import { api } from '../../src/lib/api';
import {
  exportStaffAnalyticsToExcel,
  exportStaffAnalyticsToPDF,
  exportStudentMarkListToExcel,
  exportStudentMarkListToPDF,
  StudentMarkItem,
} from '../../src/utils/staffAnalyticsExport';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SubjectAnalyticsItem {
  section: { id: string; name: string; class?: { id: string; name: string } };
  subject: { id: string; name: string };
  totalStudents: { male: number; female: number; overall: number };
  appeared: { male: number; female: number; overall: number };
  absent: { male: number; female: number; overall: number };
  pendingMarkEntry: { male: number; female: number; overall: number };
  numberOfPassStudents: { male: number; female: number; overall: number };
  numberOfFailStudents: { male: number; female: number; overall: number };
  passPercentage: { male: number; female: number; overall: number };
  failPercentage: { male: number; female: number; overall: number };
  averageMark: { male: number; female: number; overall: number };
  highestMark: { male: number; female: number; overall: number };
  highestMarkStudentName: { male: string; female: string; overall: string };
  lowestMark: { male: number; female: number; overall: number };
  lowestMarkStudentName: { male: string; female: string; overall: string };
}

interface StaffMemberAnalytics {
  id: string;
  name: string;
  email?: string;
  analytics: SubjectAnalyticsItem[];
  overall: {
    totalStudents: { male: number; female: number; overall: number };
    appeared: { male: number; female: number; overall: number };
    absent: { male: number; female: number; overall: number };
    pendingMarkEntry: { male: number; female: number; overall: number };
    numberOfPassStudents: { male: number; female: number; overall: number };
    numberOfFailStudents: { male: number; female: number; overall: number };
    passPercentage: { male: number; female: number; overall: number };
    failPercentage: { male: number; female: number; overall: number };
    averageMark: { male: number; female: number; overall: number };
    highestMark: { male: number; female: number; overall: number };
    lowestMark: { male: number; female: number; overall: number };
  };
}

interface SubjectHeaderItem {
  id: string;
  name: string;
  partitions: string[];
}

interface StaffAnalysisApiResponse {
  success: boolean;
  exam: { id: string; name: string };
  class: { id: string; name: string };
  section: { id: string; name: string };
  summary: {
    totalStudents: number;
    appeared: number;
    absent: number;
    pending: number;
    pass: number;
    fail: number;
    passPercentage: number;
    failPercentage: number;
    averageMark: number;
    highestMark: number;
    lowestMark: number;
  } | null;
  staffAnalytics: StaffMemberAnalytics[];
  studentMarkList?: StudentMarkItem[];
  subjectHeaders?: SubjectHeaderItem[];
  isSectionIncharge?: boolean;
  canViewOtherStaff?: boolean;
}

export default function StaffAnalysisScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const routeParams = useLocalSearchParams<{
    examId?: string;
    classId?: string;
    sectionId?: string;
  }>();

  // Filters State
  const [filters, setFilters] = useState<StaffAnalyticsFilterResult | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Data State
  const [data, setData] = useState<StaffAnalysisApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Export Progress State
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);

  // Expanded staff card IDs
  const [expandedStaffIds, setExpandedStaffIds] = useState<Set<string>>(new Set());

  // User-scoped cache key
  const cacheKey = useMemo(() => {
    if (!user?.id || !filters?.examId) return null;
    return `@rexdeia_staff_analytics_${user.id}_${filters.examId}_${filters.classId}_${filters.sectionId}`;
  }, [user?.id, filters]);

  // Initial setup: Default to initial exam or open filter
  useEffect(() => {
    (async () => {
      try {
        // Fetch default ongoing exam if not set
        if (!filters) {
          const analyticsRes = await api.get<any>('/api/mobile/v1/analytics').catch(() => null);
          const exams = [
            ...(analyticsRes?.data?.ongoingExams || []),
            ...(analyticsRes?.data?.upcomingDeadlines || []),
            ...(analyticsRes?.data?.recentExams || []),
          ];

          if (exams.length > 0) {
            const firstExam = exams[0];
            setFilters({
              examId: routeParams.examId || firstExam.id,
              examName: firstExam.name,
              classId: routeParams.classId || 'all',
              className: 'Overall (All Classes)',
              sectionId: routeParams.sectionId || 'all',
              sectionName: 'Overall (All Sections)',
            });
          } else {
            setIsFilterModalOpen(true);
          }
        }
      } catch {
        setIsFilterModalOpen(true);
      }
    })();
  }, []);

  // Load cached analytics on filter change
  useEffect(() => {
    if (!cacheKey) return;
    (async () => {
      try {
        const cached = await AsyncStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.staffAnalytics) {
            setData(parsed);
          }
        }
      } catch {}
    })();
  }, [cacheKey]);

  // Fetch staff analytics from backend
  const fetchAnalytics = useCallback(
    async (appliedFilters: StaffAnalyticsFilterResult, isPullRefresh = false) => {
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

        const res = await api.get<StaffAnalysisApiResponse>(
          `/api/mobile/v1/analytics/staff-analysis?${queryParams}`
        );

        if (res && res.success) {
          setData(res);
          // Expand first 2 staff cards by default
          if (res.staffAnalytics && res.staffAnalytics.length > 0) {
            const initialExpanded = new Set<string>();
            res.staffAnalytics.slice(0, 3).forEach((s) => initialExpanded.add(s.id));
            setExpandedStaffIds(initialExpanded);
          }

          // Cache result
          if (cacheKey) {
            await AsyncStorage.setItem(cacheKey, JSON.stringify(res)).catch(() => {});
          }
        } else {
          setErrorMessage('Unable to load analytics data.');
        }
      } catch (err: any) {
        const msg = err?.data?.message || err?.message || 'Failed to fetch staff analytics.';
        setErrorMessage(msg);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [cacheKey]
  );

  // Re-fetch when filters change
  useEffect(() => {
    if (filters?.examId) {
      fetchAnalytics(filters);
    }
  }, [filters]);

  const handleApplyFilters = (newFilters: StaffAnalyticsFilterResult) => {
    setFilters(newFilters);
  };

  const toggleStaffExpand = (staffId: string) => {
    try {
      Haptics.selectionAsync();
    } catch {}
    setExpandedStaffIds((prev) => {
      const next = new Set(prev);
      if (next.has(staffId)) {
        next.delete(staffId);
      } else {
        next.add(staffId);
      }
      return next;
    });
  };

  // Export Handlers
  const handleExportPDF = async () => {
    if (!data || !filters) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setIsExportingPDF(true);
      await exportStaffAnalyticsToPDF({
        examName: filters.examName,
        className: filters.className,
        sectionName: filters.sectionName,
        summary: data.summary,
        staffAnalytics: data.staffAnalytics,
      });
    } catch (err: any) {
      Alert.alert('PDF Export Error', err?.message || 'Failed to export PDF.');
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleExportExcel = async () => {
    if (!data || !filters) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setIsExportingExcel(true);
      await exportStaffAnalyticsToExcel({
        examName: filters.examName,
        className: filters.className,
        sectionName: filters.sectionName,
        summary: data.summary,
        staffAnalytics: data.staffAnalytics,
      });
    } catch (err: any) {
      Alert.alert('Excel Export Error', err?.message || 'Failed to export Excel.');
    } finally {
      setIsExportingExcel(false);
    }
  };

  const summary = data?.summary;
  const staffList = data?.staffAnalytics || [];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <Header
        title="Analytics & Marklist"
        subtitle="Staff analytics and student mark list reports"
        showSearch={false}
      />

      <OfflineStatusBar />

      {/* Filter Selector Strip */}
      <View style={styles.filterBarWrapper}>
        <TouchableOpacity
          style={styles.filterBarCard}
          onPress={() => setIsFilterModalOpen(true)}
          activeOpacity={0.8}
        >
          <View style={styles.filterBarLeft}>
            <View style={styles.filterIconCircle}>
              <Filter size={16} color="#6559FC" />
            </View>
            <View style={styles.filterBarTextCol}>
              {filters ? (
                <>
                  <Text style={styles.filterBarMainText} numberOfLines={1}>
                    {filters.examName}
                  </Text>
                  <Text style={styles.filterBarSubText} numberOfLines={1}>
                    {filters.className} • {filters.sectionName}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.filterBarPlaceholderText}>Select Exam, Class & Section</Text>
                  <Text style={styles.filterBarSubText}>Tap to choose options and load analytics</Text>
                </>
              )}
            </View>
          </View>
          <View style={styles.changeFilterPill}>
            <Text style={styles.changeFilterPillText}>{filters ? 'Change' : 'Filter'}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Active Scope Badge (Incharge vs Personal View) */}
      {data && (
        <View style={styles.scopeBannerContainer}>
          {data.canViewOtherStaff ? (
            <View style={styles.scopeBadgeIncharge}>
              <Crown size={14} color="#B45309" style={{ marginRight: 6 }} />
              <Text style={styles.scopeBadgeInchargeText}>
                Section Incharge View: Displaying all staff & subjects in {filters?.sectionName}
              </Text>
            </View>
          ) : (
            <View style={styles.scopeBadgePersonal}>
              <User size={13} color="#4338CA" style={{ marginRight: 6 }} />
              <Text style={styles.scopeBadgePersonalText}>
                My Analytics View: Displaying your personal teaching analytics only
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Shortcut to Student Marklist */}
      {data && (
        <View style={styles.shortcutContainer}>
          <TouchableOpacity
            style={styles.shortcutCard}
            onPress={() => router.push('/(tabs)/student-marklist')}
            activeOpacity={0.8}
          >
            <View style={styles.shortcutLeft}>
              <View style={styles.shortcutIconWrap}>
                <GraduationCap size={16} color="#6559FC" />
              </View>
              <View>
                <Text style={styles.shortcutTitle}>Student Marklist</Text>
                <Text style={styles.shortcutSub}>View detailed mark sheet, ranks & partitions</Text>
              </View>
            </View>
            <ChevronRight size={16} color="#6559FC" />
          </TouchableOpacity>
        </View>
      )}

      {/* Quick Action Export Bar */}
      {data && staffList.length > 0 && (
        <View style={styles.exportBar}>
          <Text style={styles.exportBarTitle}>Download Staff Reports:</Text>
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

            {/* Excel Sheet Export */}
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


      {/* Main Content Area */}
      {isLoading && !isRefreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#6559FC" />
          <Text style={styles.loadingText}>Computing subject & staff performance...</Text>
        </View>
      ) : errorMessage && !data ? (
        <View style={styles.centerContainer}>
          <View style={[styles.emptyIconCircle, { backgroundColor: '#FEE2E2' }]}>
            <AlertCircle size={32} color="#DC2626" />
          </View>
          <Text style={styles.emptyTitle}>Analytics Unavailable</Text>
          <Text style={styles.emptySubtitle}>{errorMessage}</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => filters && fetchAnalytics(filters)}
          >
            <RefreshCw size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.retryBtnText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : !filters ? (
        <View style={styles.centerContainer}>
          <View style={styles.emptyIconCircle}>
            <Sparkles size={32} color="#6559FC" />
          </View>
          <Text style={styles.emptyTitle}>Select Analytics Filter</Text>
          <Text style={styles.emptySubtitle}>
            Choose an exam and class/section to generate performance analytics.
          </Text>
          <TouchableOpacity
            style={styles.primaryActionBtn}
            onPress={() => setIsFilterModalOpen(true)}
          >
            <Filter size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.primaryActionBtnText}>Select Filters</Text>
          </TouchableOpacity>
        </View>
      ) : staffList.length === 0 ? (
        <View style={styles.centerContainer}>
          <View style={[styles.emptyIconCircle, { backgroundColor: '#F1F5F9' }]}>
            <Users size={32} color="#94A3B8" />
          </View>
          <Text style={styles.emptyTitle}>No Analytics Data</Text>
          <Text style={styles.emptySubtitle}>
            No marks or staff assignments were found for {filters.className} ({filters.sectionName}) in {filters.examName}.
          </Text>
          <TouchableOpacity
            style={styles.secondaryActionBtn}
            onPress={() => setIsFilterModalOpen(true)}
          >
            <Text style={styles.secondaryActionBtnText}>Change Filters</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.contentScroll}
          contentContainerStyle={styles.contentScrollContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => filters && fetchAnalytics(filters, true)}
              tintColor="#6559FC"
              colors={['#6559FC']}
            />
          }
        >
          <>
            {/* Executive Overview KPI Grid */}
              {summary && (
                <View style={styles.kpiContainer}>
                  <View style={styles.kpiHeaderRow}>
                    <Text style={styles.kpiHeaderTitle}>Executive Overview</Text>
                    <View style={styles.overallBadge}>
                      <Sparkles size={12} color="#6559FC" style={{ marginRight: 4 }} />
                      <Text style={styles.overallBadgeText}>{filters.className}</Text>
                    </View>
                  </View>

                  <View style={styles.kpiGrid}>
                    {/* Appeared & Total */}
                    <View style={styles.kpiCard}>
                      <View style={[styles.kpiIconWrap, { backgroundColor: '#EEF2FF' }]}>
                        <Users size={16} color="#6559FC" />
                      </View>
                      <Text style={styles.kpiValue}>
                        {summary.appeared}{' '}
                        <Text style={{ fontSize: 11, color: '#64748B' }}>/ {summary.totalStudents}</Text>
                      </Text>
                      <Text style={styles.kpiLabel}>
                        Appeared ({summary.absent} Absent)
                      </Text>
                    </View>

                    {/* Pass Percentage */}
                    <View style={styles.kpiCard}>
                      <View style={[styles.kpiIconWrap, { backgroundColor: '#DCFCE7' }]}>
                        <TrendingUp size={16} color="#15803D" />
                      </View>
                      <Text style={[styles.kpiValue, { color: '#15803D' }]}>
                        {(Number(summary.passPercentage) || 0).toFixed(1)}%
                      </Text>
                      <Text style={styles.kpiLabel}>
                        Pass Rate ({summary.pass} P • {summary.fail} F)
                      </Text>
                    </View>

                    {/* Class Average */}
                    <View style={styles.kpiCard}>
                      <View style={[styles.kpiIconWrap, { backgroundColor: '#FEF3C7' }]}>
                        <Award size={16} color="#D97706" />
                      </View>
                      <Text style={[styles.kpiValue, { color: '#B45309' }]}>
                        {(Number(summary.averageMark) || 0).toFixed(1)}
                      </Text>
                      <Text style={styles.kpiLabel}>Average Score</Text>
                    </View>

                    {/* High / Low Range */}
                    <View style={styles.kpiCard}>
                      <View style={[styles.kpiIconWrap, { backgroundColor: '#F1F5F9' }]}>
                        <GraduationCap size={16} color="#475569" />
                      </View>
                      <Text style={styles.kpiValue}>
                        {summary.highestMark}{' '}
                        <Text style={{ fontSize: 11, color: '#94A3B8' }}>/ {summary.lowestMark}</Text>
                      </Text>
                      <Text style={styles.kpiLabel}>Highest / Lowest Mark</Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Section & Staff Breakdown Header */}
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionHeaderTitle}>
                  {data?.canViewOtherStaff
                    ? `Staff-Wise Subject Analysis (${staffList.length} Staff)`
                    : `My Subject Analysis (${staffList[0]?.analytics?.length || 0} ${
                        staffList[0]?.analytics?.length === 1 ? 'Subject' : 'Subjects'
                      })`}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    if (expandedStaffIds.size === staffList.length) {
                      setExpandedStaffIds(new Set());
                    } else {
                      setExpandedStaffIds(new Set(staffList.map((s) => s.id)));
                    }
                  }}
                >
                  <Text style={styles.expandAllText}>
                    {expandedStaffIds.size === staffList.length ? 'Collapse All' : 'Expand All'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Staff Cards List */}
              {staffList.map((staff) => {
                const isExpanded = expandedStaffIds.has(staff.id);
                return (
                  <View key={staff.id} style={styles.staffCard}>
                    {/* Staff Card Header Accordion */}
                    <TouchableOpacity
                      style={styles.staffCardHeader}
                      onPress={() => toggleStaffExpand(staff.id)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.staffHeaderLeft}>
                        <View style={styles.staffAvatar}>
                          <User size={18} color="#6559FC" />
                        </View>
                        <View style={styles.staffInfoCol}>
                          <Text style={styles.staffNameText} numberOfLines={1}>
                            {staff.name}
                          </Text>
                          <Text style={styles.staffMetaText} numberOfLines={1}>
                            {staff.analytics.length} {staff.analytics.length === 1 ? 'Subject' : 'Subjects'} • Avg:{' '}
                            {(Number(staff.overall?.averageMark?.overall) || 0).toFixed(1)} • Pass:{' '}
                            {(Number(staff.overall?.passPercentage?.overall) || 0).toFixed(0)}%
                          </Text>
                        </View>
                      </View>

                      <View style={styles.staffHeaderRight}>
                        <View
                          style={[
                            styles.passRateBadge,
                            (Number(staff.overall?.passPercentage?.overall) || 0) >= 75
                              ? styles.passRateBadgeHigh
                              : (Number(staff.overall?.passPercentage?.overall) || 0) >= 50
                              ? styles.passRateBadgeMed
                              : styles.passRateBadgeLow,
                          ]}
                        >
                          <Text
                            style={[
                              styles.passRateBadgeText,
                              (Number(staff.overall?.passPercentage?.overall) || 0) >= 75
                                ? styles.passRateBadgeTextHigh
                                : (Number(staff.overall?.passPercentage?.overall) || 0) >= 50
                                ? styles.passRateBadgeTextMed
                                : styles.passRateBadgeTextLow,
                            ]}
                          >
                            {(Number(staff.overall?.passPercentage?.overall) || 0).toFixed(0)}% Pass
                          </Text>
                        </View>
                        {isExpanded ? (
                          <ChevronUp size={18} color="#94A3B8" />
                        ) : (
                          <ChevronDown size={18} color="#94A3B8" />
                        )}
                      </View>
                    </TouchableOpacity>

                    {/* Expanded Subjects Table */}
                    {isExpanded && (
                      <View style={styles.staffCardBody}>
                        {staff.analytics.map((sub, sIdx) => {
                          return (
                            <View key={`${sub.section?.id}_${sub.subject?.id}_${sIdx}`} style={styles.subjectBox}>
                              {/* Subject Title Bar */}
                              <View style={styles.subjectTopRow}>
                                <View style={styles.subjectTitleGroup}>
                                  <Text style={styles.subjectNameText}>{sub.subject?.name}</Text>
                                  <View style={styles.sectionBadge}>
                                    <Text style={styles.sectionBadgeText}>
                                      {sub.section?.class?.name ? `${sub.section.class.name} - ` : ''}Sec{' '}
                                      {sub.section?.name}
                                    </Text>
                                  </View>
                                </View>

                                <Text style={styles.subjectAvgText}>
                                  Avg: <Text style={{ fontWeight: '800', color: '#0F172A' }}>{(Number(sub.averageMark?.overall) || 0).toFixed(1)}</Text>
                                </Text>
                              </View>

                              {/* Metrics Grid for this Subject */}
                              <View style={styles.subjectMetricsGrid}>
                                {/* Total / Appeared */}
                                <View style={styles.subMetricCol}>
                                  <Text style={styles.subMetricLabel}>Total / App</Text>
                                  <Text style={styles.subMetricValue}>
                                    {sub.totalStudents.overall} / {sub.appeared.overall}
                                  </Text>
                                  <Text style={styles.genderSubText}>
                                    M:{sub.appeared.male} F:{sub.appeared.female}
                                  </Text>
                                </View>

                                {/* Pass Rate */}
                                <View style={styles.subMetricCol}>
                                  <Text style={styles.subMetricLabel}>Pass Rate</Text>
                                  <Text style={[styles.subMetricValue, { color: '#16A34A' }]}>
                                    {(Number(sub.passPercentage?.overall) || 0).toFixed(1)}%
                                  </Text>
                                  <Text style={styles.genderSubText}>
                                    {sub.numberOfPassStudents.overall} P • {sub.numberOfFailStudents.overall} F
                                  </Text>
                                </View>

                                {/* Highest Score */}
                                <View style={styles.subMetricCol}>
                                  <Text style={styles.subMetricLabel}>High / Low</Text>
                                  <Text style={styles.subMetricValue}>
                                    {sub.highestMark.overall} / {sub.lowestMark.overall}
                                  </Text>
                                  {sub.highestMarkStudentName.overall ? (
                                    <Text style={styles.genderSubText} numberOfLines={1}>
                                      ⭐ {sub.highestMarkStudentName.overall}
                                    </Text>
                                  ) : null}
                                </View>

                                {/* Absent Count */}
                                <View style={styles.subMetricCol}>
                                  <Text style={styles.subMetricLabel}>Absent</Text>
                                  <Text
                                    style={[
                                      styles.subMetricValue,
                                      { color: sub.absent.overall > 0 ? '#DC2626' : '#64748B' },
                                    ]}
                                  >
                                    {sub.absent.overall}
                                  </Text>
                                  <Text style={styles.genderSubText}>
                                    M:{sub.absent.male} F:{sub.absent.female}
                                  </Text>
                                </View>
                              </View>
                            </View>
                          );
                        })}

                        {/* Staff Overall Combined Box if >1 subject */}
                        {staff.analytics.length > 1 && (
                          <View style={styles.staffOverallSummaryBox}>
                            <View style={styles.staffOverallHeader}>
                              <Sparkles size={14} color="#6559FC" style={{ marginRight: 6 }} />
                              <Text style={styles.staffOverallTitle}>
                                {staff.name} • Combined Overall
                              </Text>
                            </View>
                            <View style={styles.staffOverallMetricsRow}>
                              <Text style={styles.staffOverallMetricItem}>
                                Appeared:{' '}
                                <Text style={{ fontWeight: '700', color: '#0F172A' }}>
                                  {staff.overall.appeared.overall}
                                </Text>
                              </Text>
                              <Text style={styles.staffOverallMetricItem}>
                                Avg:{' '}
                                <Text style={{ fontWeight: '700', color: '#0F172A' }}>
                                  {(Number(staff.overall?.averageMark?.overall) || 0).toFixed(1)}
                                </Text>
                              </Text>
                              <Text style={styles.staffOverallMetricItem}>
                                Pass:{' '}
                                <Text style={{ fontWeight: '700', color: '#16A34A' }}>
                                  {(Number(staff.overall?.passPercentage?.overall) || 0).toFixed(1)}%
                                </Text>
                              </Text>
                              <Text style={styles.staffOverallMetricItem}>
                                Fail:{' '}
                                <Text style={{ fontWeight: '700', color: '#DC2626' }}>
                                  {(Number(staff.overall?.failPercentage?.overall) || 0).toFixed(1)}%
                                </Text>
                              </Text>
                            </View>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                );
              })}
            </>

          <View style={{ height: 90 }} />
        </ScrollView>
      )}

      {/* Filter Modal */}
      <StaffAnalyticsFilterModal
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
  shortcutContainer: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  shortcutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  shortcutLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  shortcutIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shortcutTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  shortcutSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  filterBarWrapper: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 4,
  },
  filterBarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  filterBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  filterIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  filterBarTextCol: {
    flex: 1,
  },
  filterBarMainText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  filterBarSubText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  filterBarPlaceholderText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6559FC',
  },
  changeFilterPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  changeFilterPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6559FC',
  },

  /* Active Scope Banners */
  scopeBannerContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  scopeBadgeIncharge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  scopeBadgeInchargeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#92400E',
    flex: 1,
  },
  scopeBadgePersonal: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#E0E7FF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  scopeBadgePersonalText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4338CA',
    flex: 1,
  },

  /* Export Action Bar */
  exportBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  exportBarTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  exportActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  exportBtnPdf: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  exportBtnExcel: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
  },
  exportBtnTextPdf: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  exportBtnTextExcel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803D',
  },

  /* Main Scroll */
  contentScroll: {
    flex: 1,
  },
  contentScrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },

  /* KPI Grid */
  kpiContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  kpiHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  kpiHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  overallBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  overallBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6559FC',
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  kpiCard: {
    flex: 1,
    minWidth: (SCREEN_WIDTH - 72) / 2,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  kpiIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  kpiValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  kpiLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },

  /* Section Header */
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 4,
  },
  sectionHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  expandAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6559FC',
  },

  /* Staff Cards */
  staffCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  staffCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    backgroundColor: '#FFFFFF',
  },
  staffHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  staffAvatar: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  staffInfoCol: {
    flex: 1,
  },
  staffNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  staffMetaText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  staffHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  passRateBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  passRateBadgeHigh: { backgroundColor: '#DCFCE7' },
  passRateBadgeMed: { backgroundColor: '#FEF3C7' },
  passRateBadgeLow: { backgroundColor: '#FEE2E2' },
  passRateBadgeText: { fontSize: 11, fontWeight: '700' },
  passRateBadgeTextHigh: { color: '#15803D' },
  passRateBadgeTextMed: { color: '#B45309' },
  passRateBadgeTextLow: { color: '#DC2626' },

  staffCardBody: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#F8FAFC',
    padding: 12,
    gap: 10,
  },
  subjectBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
  },
  subjectTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  subjectTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  subjectNameText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  sectionBadge: {
    backgroundColor: '#FEF9C3',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FDE047',
  },
  sectionBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#854D0E',
  },
  subjectAvgText: {
    fontSize: 11,
    color: '#64748B',
  },
  subjectMetricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  subMetricCol: {
    flex: 1,
    alignItems: 'center',
  },
  subMetricLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 2,
  },
  subMetricValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  genderSubText: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 1,
  },

  staffOverallSummaryBox: {
    backgroundColor: '#EEF2FF',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  staffOverallHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  staffOverallTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4338CA',
  },
  staffOverallMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  staffOverallMetricItem: {
    fontSize: 11,
    color: '#475569',
  },

  /* Empty & Loading States */
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
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
  loadingText: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 12,
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6559FC',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  primaryActionBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryActionBtn: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  secondaryActionBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DC2626',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  /* Navigation Tab Bar */
  tabBarContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabButtonActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6559FC',
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  tabButtonTextActive: {
    color: '#6559FC',
    fontWeight: '700',
  },
  tabBadge: {
    marginLeft: 6,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  tabBadgeActive: {
    backgroundColor: '#6559FC',
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  tabBadgeTextActive: {
    color: '#FFFFFF',
  },

  /* Search & Filters for Marklist */
  searchBarCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    paddingVertical: 0,
  },
  searchClearBtn: {
    padding: 4,
  },
  filterChipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: '#6559FC',
    borderColor: '#6559FC',
  },
  filterChipActivePass: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  filterChipActiveFail: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  filterChipActiveAbsent: {
    backgroundColor: '#64748B',
    borderColor: '#64748B',
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  filterChipTextActivePass: {
    color: '#FFFFFF',
  },
  filterChipTextActiveFail: {
    color: '#FFFFFF',
  },
  filterChipTextActiveAbsent: {
    color: '#FFFFFF',
  },

  /* Swipe Scroll Hint */
  swipeScrollHintText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6559FC',
  },

  /* Detailed Student Marklist Table (Matching Web Screenshot) */
  tableCardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginTop: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  tableScrollContent: {
    minWidth: '100%',
  },
  tableContentWrap: {
    flexDirection: 'column',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#EDE9FE',
    borderBottomWidth: 1.5,
    borderBottomColor: '#DDD6FE',
  },
  thCell: {
    paddingVertical: 10,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thColIndex: {
    width: 48,
    flexDirection: 'row',
  },
  thColName: {
    width: 175,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: 12,
  },
  thColSubject: {
    width: 165,
  },
  thColTotal: {
    width: 115,
    flexDirection: 'row',
  },
  thColRank: {
    width: 105,
    flexDirection: 'row',
  },
  thText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3730A3',
  },
  sortIndicatorText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4F46E5',
    marginLeft: 3,
  },
  thSubjectTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3730A3',
    textAlign: 'center',
    marginBottom: 4,
  },
  thSubjectPartitionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 4,
  },
  thPartitionName: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4338CA',
  },
  thTotName: {
    fontWeight: '800',
    color: '#3730A3',
  },

  /* Data Rows */
  tableDataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
    minHeight: 54,
  },
  tableDataRowEven: {
    backgroundColor: '#FAF5FF',
  },
  tdCell: {
    paddingVertical: 10,
    paddingHorizontal: 6,
    justifyContent: 'center',
  },
  tdColIndex: {
    width: 48,
    alignItems: 'center',
  },
  tdIndexText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  tdColName: {
    width: 175,
    paddingLeft: 12,
  },
  tdStudentNameText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  tdSectionText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
  },
  tdColSubject: {
    width: 165,
  },
  tdSubjectContentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 4,
  },
  tdPartitionMark: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '500',
  },
  tdSubTotText: {
    fontSize: 11,
    fontWeight: '800',
  },
  tdPassText: {
    color: '#16A34A',
  },
  tdFailText: {
    color: '#DC2626',
  },
  tdAbsentText: {
    color: '#DC2626',
    fontWeight: '800',
  },
  tdColTotal: {
    width: 115,
    alignItems: 'center',
  },
  tdTotalStatusText: {
    fontSize: 10,
    fontWeight: '800',
  },
  tdTotalValueText: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  tdColRank: {
    width: 105,
    alignItems: 'center',
  },
  tdRankValueText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  tdCentumText: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },

  /* Empty Student Box */
  studentEmptyBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  studentEmptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 10,
  },
  studentEmptySubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
  resetFilterBtn: {
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
  },
  resetFilterBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6559FC',
  },
});
