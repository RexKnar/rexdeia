import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  AlertCircle,
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Flame,
  GraduationCap,
  Layers,
  Plus,
  RefreshCw,
  Sparkles,
  Users,
} from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../src/components/Header';
import { useAuth } from '../../src/context/auth';
import { api } from '../../src/lib/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ExamItem {
  id: string;
  name: string;
  termName: string;
  examTypeName: string;
  batchName: string;
  isActive: boolean;
  blockMarkEntry: boolean;
  markEntryOpenDate: string | null;
  markEntryEndDate: string | null;
  markEntryCorrectionDate: string | null;
  status: 'UPCOMING' | 'ONGOING' | 'CORRECTION' | 'COMPLETED';
  daysRemaining: number | null;
  isUrgent: boolean;
  classesCount: number;
  sectionsCount: number;
  classesSummary: string;
  isAssignedToStaff: boolean;
  totalMarksEntered: number;
  firstClassId: string | null;
  firstSectionId: string | null;
}

interface AnalyticsData {
  batchName: string;
  metrics: {
    assignedClassesCount: number;
    assignedSectionsCount: number;
    subjectsHandledCount: number;
    assignedStudentsCount: number;
    ongoingExamsCount: number;
    pendingDeadlinesCount: number;
  };
  ongoingExams: ExamItem[];
  upcomingDeadlines: ExamItem[];
  recentExams: ExamItem[];
}

export default function AnalyticsDashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // User-scoped cache key
  const storageKey = user?.id ? `@rexdeia_exam_analytics_v2_${user.id}` : null;

  // Reset state on user switch
  useEffect(() => {
    setData(null);
    setErrorMessage(null);
    if (!user?.id) {
      setIsLoading(false);
      return;
    }
    loadCachedAnalytics();
    fetchAnalytics();
  }, [user?.id]);

  const loadCachedAnalytics = async () => {
    if (!storageKey) return;
    try {
      const cached = await AsyncStorage.getItem(storageKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === 'object' && parsed.metrics) {
          setData(parsed);
          setIsLoading(false);
        } else {
          await AsyncStorage.removeItem(storageKey);
        }
      }
    } catch {}
  };

  const fetchAnalytics = useCallback(async (isPullToRefresh = false) => {
    if (!user?.id) {
      setIsLoading(false);
      setIsRefreshing(false);
      return;
    }

    if (isPullToRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setErrorMessage(null);

    try {
      const res = await api.get<{ success: boolean; data: AnalyticsData }>(
        '/api/mobile/v1/analytics'
      );
      if (res?.data) {
        setData(res.data);
        if (storageKey) {
          await AsyncStorage.setItem(storageKey, JSON.stringify(res.data));
        }
      }
    } catch (err: any) {
      if (err?.message !== 'SESSION_EXPIRED') {
        console.warn('Failed to load analytics:', err);
        setErrorMessage(
          err?.message || 'Unable to load exam analytics. Please check connection.'
        );
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [user?.id, storageKey]);

  const handleRefresh = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    fetchAnalytics(true);
  };

  const handleNavigateToMarkEntry = async (exam: ExamItem) => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    const params = new URLSearchParams();
    params.set('examId', exam.id);
    if (exam.firstClassId) params.set('classId', exam.firstClassId);
    if (exam.firstSectionId) params.set('sectionId', exam.firstSectionId);
    router.push(`/(tabs)/exams?${params.toString()}`);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Not set';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const metrics = data?.metrics ?? {
    assignedClassesCount: 0,
    assignedSectionsCount: 0,
    subjectsHandledCount: 0,
    assignedStudentsCount: 0,
    ongoingExamsCount: 0,
    pendingDeadlinesCount: 0,
  };
  const ongoingExams = Array.isArray(data?.ongoingExams) ? data.ongoingExams : [];
  const upcomingDeadlines = Array.isArray(data?.upcomingDeadlines) ? data.upcomingDeadlines : [];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header
        title="Dashboard"
        subtitle={data?.batchName || 'Academic Performance Hub'}
        showSearch={false}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#6559FC"
            colors={['#6559FC']}
          />
        }
      >
        {/* Loading Spinner */}
        {isLoading && !data && (
          <View style={styles.loadingWrapper}>
            <ActivityIndicator size="large" color="#6559FC" />
            <Text style={styles.loadingText}>Loading dashboard insights...</Text>
          </View>
        )}

        {/* Error Notice */}
        {errorMessage && !data && (
          <View style={styles.errorWrapper}>
            <AlertCircle size={28} color="#EF4444" />
            <Text style={styles.errorTitle}>Dashboard Unavailable</Text>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => fetchAnalytics()}
              activeOpacity={0.8}
            >
              <RefreshCw size={16} color="#FFFFFF" />
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Loaded Content */}
        {data && (
          <>
            {/* Quick Metrics Bar: Classes, Sections, Subjects Handled, Responsible Students */}
            <View style={styles.metricsGrid}>
              {/* Assigned Classes */}
              <View style={styles.metricCard}>
                <View style={[styles.metricIconWrap, { backgroundColor: '#EEF2FF' }]}>
                  <GraduationCap size={18} color="#6559FC" />
                </View>
                <Text style={styles.metricNumber}>
                  {metrics.assignedClassesCount}
                </Text>
                <Text style={styles.metricLabel}>Classes</Text>
              </View>

              {/* Assigned Sections */}
              <View style={styles.metricCard}>
                <View style={[styles.metricIconWrap, { backgroundColor: '#ECFDF5' }]}>
                  <Layers size={18} color="#059669" />
                </View>
                <Text style={styles.metricNumber}>
                  {metrics.assignedSectionsCount}
                </Text>
                <Text style={styles.metricLabel}>Sections</Text>
              </View>

              {/* Total Subjects Handled */}
              <View style={styles.metricCard}>
                <View style={[styles.metricIconWrap, { backgroundColor: '#FEF3C7' }]}>
                  <BookOpen size={18} color="#D97706" />
                </View>
                <Text style={styles.metricNumber}>
                  {metrics.subjectsHandledCount}
                </Text>
                <Text style={styles.metricLabel}>Subjects</Text>
              </View>

              {/* Responsible Students */}
              <View style={styles.metricCard}>
                <View style={[styles.metricIconWrap, { backgroundColor: '#EFF6FF' }]}>
                  <Users size={18} color="#2563EB" />
                </View>
                <Text style={styles.metricNumber}>
                  {metrics.assignedStudentsCount}
                </Text>
                <Text style={styles.metricLabel}>Students</Text>
              </View>
            </View>

            {/* Staff & Subject Analytics Banner */}
            <TouchableOpacity
              style={styles.staffAnalyticsCard}
              onPress={() => router.push('/(tabs)/staff-analysis')}
              activeOpacity={0.85}
            >
              <View style={styles.staffAnalyticsCardLeft}>
                <View style={styles.staffAnalyticsIconWrap}>
                  <Award size={22} color="#6559FC" />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.staffAnalyticsCardTitle}>Staff & Subject Analytics</Text>
                    <View style={styles.newBadge}>
                      <Text style={styles.newBadgeText}>PDF & Excel</Text>
                    </View>
                  </View>
                  <Text style={styles.staffAnalyticsCardSubtitle}>
                    Class & section performance with export options
                  </Text>
                </View>
              </View>
              <ChevronRight size={18} color="#6559FC" />
            </TouchableOpacity>

            {/* Student Marklist Banner */}
            <TouchableOpacity
              style={[styles.staffAnalyticsCard, { marginTop: 10, borderColor: '#BBF7D0' }]}
              onPress={() => router.push('/(tabs)/student-marklist')}
              activeOpacity={0.85}
            >
              <View style={styles.staffAnalyticsCardLeft}>
                <View style={[styles.staffAnalyticsIconWrap, { backgroundColor: '#F0FDF4' }]}>
                  <GraduationCap size={22} color="#16A34A" />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.staffAnalyticsCardTitle}>Student Marklist</Text>
                    <View style={[styles.newBadge, { backgroundColor: '#DCFCE7' }]}>
                      <Text style={[styles.newBadgeText, { color: '#15803D' }]}>Marksheet</Text>
                    </View>
                  </View>
                  <Text style={styles.staffAnalyticsCardSubtitle}>
                    Student-wise scores, partitions, ranks & reports
                  </Text>
                </View>
              </View>
              <ChevronRight size={18} color="#16A34A" />
            </TouchableOpacity>

            {/* SECTION 1: Currently Ongoing Exams */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionTitleGroup}>
                  <View style={styles.liveIndicatorDot} />
                  <Text style={styles.sectionTitle}>CURRENTLY ONGOING EXAMS</Text>
                </View>
                <Text style={styles.sectionBadge}>
                  {ongoingExams.length} Active
                </Text>
              </View>

              {ongoingExams.length === 0 ? (
                <View style={styles.emptyCard}>
                  <CheckCircle2 size={32} color="#10B981" />
                  <Text style={styles.emptyCardTitle}>No Exams in Session</Text>
                  <Text style={styles.emptyCardSubtitle}>
                    There are no exams currently active for mark submission.
                  </Text>
                </View>
              ) : (
                <View style={styles.examCardsList}>
                  {ongoingExams.map((exam) => (
                    <View key={exam.id} style={styles.examCard}>
                      <View style={styles.examCardHeader}>
                        <View style={styles.examTagRow}>
                          <View style={styles.termTag}>
                            <Text style={styles.termTagText}>{exam.termName}</Text>
                          </View>
                          <View style={styles.typeTag}>
                            <Text style={styles.typeTagText}>{exam.examTypeName}</Text>
                          </View>
                        </View>

                        {/* Status Chip */}
                        <View
                          style={[
                            styles.statusChip,
                            exam.status === 'CORRECTION'
                              ? styles.statusChipWarning
                              : styles.statusChipActive,
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusChipText,
                              exam.status === 'CORRECTION'
                                ? styles.statusChipTextWarning
                                : styles.statusChipTextActive,
                            ]}
                          >
                            {exam.status === 'CORRECTION'
                              ? 'Correction Open'
                              : 'Mark Entry Open'}
                          </Text>
                        </View>
                      </View>

                      {/* Exam Title */}
                      <Text style={styles.examNameText}>{exam.name}</Text>

                      {/* Info Details */}
                      <View style={styles.examMetaGrid}>
                        {exam.classesSummary ? (
                          <View style={styles.metaItem}>
                            <Layers size={13} color="#64748B" />
                            <Text style={styles.metaText} numberOfLines={1}>
                              Classes: {exam.classesSummary}
                            </Text>
                          </View>
                        ) : null}

                        {exam.markEntryEndDate ? (
                          <View style={styles.metaItem}>
                            <Clock size={13} color={exam.isUrgent ? '#DC2626' : '#64748B'} />
                            <Text
                              style={[
                                styles.metaText,
                                exam.isUrgent && styles.metaTextUrgent,
                              ]}
                            >
                              Deadline: {formatDate(exam.markEntryEndDate)}
                            </Text>
                          </View>
                        ) : null}
                      </View>

                      {/* Card Action Button */}
                      <TouchableOpacity
                        style={styles.enterMarksBtn}
                        onPress={() => handleNavigateToMarkEntry(exam)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.enterMarksBtnText}>Open Mark Entry</Text>
                        <ArrowRight size={15} color="#FFFFFF" strokeWidth={2.5} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* SECTION 2: Upcoming Mark Entry Deadlines */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionTitleGroup}>
                  <Flame size={16} color="#EA580C" />
                  <Text style={styles.sectionTitle}>
                    UPCOMING MARK ENTRY DEADLINES
                  </Text>
                </View>
                <Text style={styles.sectionBadge}>
                  {upcomingDeadlines.length} Due Soon
                </Text>
              </View>

              {upcomingDeadlines.length === 0 ? (
                <View style={styles.emptyCard}>
                  <CheckCircle2 size={32} color="#10B981" />
                  <Text style={styles.emptyCardTitle}>No Approaching Deadlines</Text>
                  <Text style={styles.emptyCardSubtitle}>
                    All scheduled mark entries have plenty of time remaining.
                  </Text>
                </View>
              ) : (
                <View style={styles.deadlineList}>
                  {upcomingDeadlines.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.deadlineCard}
                      onPress={() => handleNavigateToMarkEntry(item)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.deadlineLeft}>
                        {/* Countdown Badge */}
                        <View
                          style={[
                            styles.countdownBadge,
                            item.isUrgent
                              ? styles.countdownBadgeUrgent
                              : styles.countdownBadgeNormal,
                          ]}
                        >
                          <Text
                            style={[
                              styles.countdownDays,
                              item.isUrgent
                                ? styles.countdownDaysUrgent
                                : styles.countdownDaysNormal,
                            ]}
                          >
                            {item.daysRemaining !== null
                              ? item.daysRemaining <= 0
                                ? 'Today'
                                : `${item.daysRemaining}d`
                              : '--'}
                          </Text>
                          <Text
                            style={[
                              styles.countdownSub,
                              item.isUrgent
                                ? styles.countdownSubUrgent
                                : styles.countdownSubNormal,
                            ]}
                          >
                            {item.daysRemaining !== null && item.daysRemaining <= 0
                              ? 'Due'
                              : 'Left'}
                          </Text>
                        </View>

                        {/* Title & Info */}
                        <View style={styles.deadlineDetails}>
                          <Text style={styles.deadlineTitle} numberOfLines={1}>
                            {item.name}
                          </Text>
                          <Text style={styles.deadlineSub}>
                            {item.termName} • Closes {formatDate(item.markEntryEndDate)}
                          </Text>
                        </View>
                      </View>

                      {/* Right Action */}
                      <View style={styles.deadlineAction}>
                        <ChevronRight size={18} color="#94A3B8" />
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* SECTION 3: Quick Navigation Shortcuts */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>ACADEMIC SHORTCUTS</Text>
              </View>

              <View style={styles.shortcutsRow}>
                <TouchableOpacity
                  style={styles.shortcutBtn}
                  onPress={() => router.push('/(tabs)/exams')}
                  activeOpacity={0.75}
                >
                  <View style={[styles.shortcutIcon, { backgroundColor: '#EEF2FF' }]}>
                    <Plus size={20} color="#6559FC" strokeWidth={2.5} />
                  </View>
                  <Text style={styles.shortcutText}>Mark Entry</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.shortcutBtn}
                  onPress={() => router.push('/(tabs)/classes')}
                  activeOpacity={0.75}
                >
                  <View style={[styles.shortcutIcon, { backgroundColor: '#F0FDF4' }]}>
                    <GraduationCap size={20} color="#16A34A" strokeWidth={2.2} />
                  </View>
                  <Text style={styles.shortcutText}>Classes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.shortcutBtn}
                  onPress={() => router.push('/(tabs)/students')}
                  activeOpacity={0.75}
                >
                  <View style={[styles.shortcutIcon, { backgroundColor: '#EFF6FF' }]}>
                    <Users size={20} color="#2563EB" strokeWidth={2.2} />
                  </View>
                  <Text style={styles.shortcutText}>Students</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.shortcutBtn}
                  onPress={() => router.push('/(tabs)/attendance')}
                  activeOpacity={0.75}
                >
                  <View style={[styles.shortcutIcon, { backgroundColor: '#FFF7ED' }]}>
                    <Calendar size={20} color="#EA580C" strokeWidth={2.2} />
                  </View>
                  <Text style={styles.shortcutText}>Attendance</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 110,
  },
  loadingWrapper: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  errorWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    marginVertical: 20,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 10,
  },
  errorText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#6559FC',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metricCard: {
    width: '23.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  metricIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  metricNumber: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  metricLabel: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
    textAlign: 'center',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveIndicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
    letterSpacing: 0.6,
  },
  sectionBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6559FC',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 8,
  },
  emptyCardSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 2,
  },
  examCardsList: {
    gap: 12,
  },
  examCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  examCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  examTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  termTag: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  termTagText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#6559FC',
  },
  typeTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  typeTagText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#475569',
  },
  statusChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusChipActive: {
    backgroundColor: '#ECFDF5',
  },
  statusChipWarning: {
    backgroundColor: '#FFFBEB',
  },
  statusChipText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statusChipTextActive: {
    color: '#059669',
  },
  statusChipTextWarning: {
    color: '#D97706',
  },
  examNameText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10,
  },
  examMetaGrid: {
    gap: 6,
    marginBottom: 14,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '500',
  },
  metaTextUrgent: {
    color: '#DC2626',
    fontWeight: '700',
  },
  enterMarksBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#6559FC',
    paddingVertical: 10,
    borderRadius: 12,
  },
  enterMarksBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  deadlineList: {
    gap: 8,
  },
  deadlineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  deadlineLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  countdownBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownBadgeUrgent: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  countdownBadgeNormal: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  countdownDays: {
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 15,
  },
  countdownDaysUrgent: {
    color: '#DC2626',
  },
  countdownDaysNormal: {
    color: '#6559FC',
  },
  countdownSub: {
    fontSize: 8.5,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  countdownSubUrgent: {
    color: '#DC2626',
  },
  countdownSubNormal: {
    color: '#6559FC',
  },
  deadlineDetails: {
    flex: 1,
  },
  deadlineTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  deadlineSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  deadlineAction: {
    paddingLeft: 8,
  },
  shortcutsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shortcutBtn: {
    width: '23%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  shortcutIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  shortcutText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
  },
  staffAnalyticsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#6559FC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  staffAnalyticsCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  staffAnalyticsIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  staffAnalyticsCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  staffAnalyticsCardSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  newBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  newBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#15803D',
  },
});
