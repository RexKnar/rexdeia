import * as Haptics from 'expo-haptics';
import {
  Award,
  Check,
  ChevronDown,
  Crown,
  Filter,
  GraduationCap,
  Sparkles,
  Users,
  X,
} from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { api } from '../lib/api';

export interface StaffAnalyticsFilterResult {
  examId: string;
  examName: string;
  classId: string;
  className: string;
  sectionId: string;
  sectionName: string;
}

interface StaffAnalyticsFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: StaffAnalyticsFilterResult) => void;
  initialClassId?: string;
  initialSectionId?: string;
  initialExamId?: string;
}

interface SectionItem {
  id: string;
  name: string;
  isClassIncharge?: boolean;
}

interface ClassItem {
  id: string;
  name: string;
  sections?: SectionItem[];
}

interface ExamItem {
  id: string;
  name: string;
  batch?: { id: string; name: string };
}

export const StaffAnalyticsFilterModal: React.FC<StaffAnalyticsFilterModalProps> = ({
  visible,
  onClose,
  onApply,
  initialClassId = 'all',
  initialSectionId = 'all',
  initialExamId,
}) => {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [configuredExams, setConfiguredExams] = useState<ExamItem[]>([]);

  const [isLoadingClasses, setIsLoadingClasses] = useState(false);
  const [isLoadingExams, setIsLoadingExams] = useState(false);

  // Flow Order: class -> section -> exam
  const [selectedClassId, setSelectedClassId] = useState<string>(initialClassId);
  const [selectedSectionId, setSelectedSectionId] = useState<string>(initialSectionId);
  const [selectedExamId, setSelectedExamId] = useState<string | undefined>(initialExamId);

  // Active step accordion
  const [openSection, setOpenSection] = useState<'class' | 'section' | 'exam'>(
    initialClassId ? (initialSectionId ? 'exam' : 'section') : 'class'
  );

  // 1. Initial load: Fetch assigned classes for this staff
  useEffect(() => {
    if (!visible) return;

    (async () => {
      try {
        setIsLoadingClasses(true);
        const classesRes = await api.get<{ data: ClassItem[] }>('/api/mobile/v1/classes');
        const classList = classesRes?.data || [];
        setClasses(classList);
      } catch {
        // Handled silently
      } finally {
        setIsLoadingClasses(false);
      }
    })();
  }, [visible]);

  // Derived selected class and available sections
  const selectedClass = useMemo(
    () => classes.find((c) => c.id === selectedClassId),
    [classes, selectedClassId]
  );

  const availableSections = useMemo(() => {
    if (!selectedClassId || selectedClassId === 'all' || !selectedClass) return [];
    return selectedClass.sections || [];
  }, [selectedClassId, selectedClass]);

  const selectedSection = useMemo(() => {
    if (selectedSectionId === 'all') return { id: 'all', name: 'Overall (All Sections)' };
    return availableSections.find((s) => s.id === selectedSectionId);
  }, [selectedSectionId, availableSections]);

  // 2. Fetch configured exams whenever classId or sectionId changes
  useEffect(() => {
    if (!selectedClassId || !selectedSectionId) {
      setConfiguredExams([]);
      return;
    }

    (async () => {
      try {
        setIsLoadingExams(true);
        const queryParams = new URLSearchParams({
          ...(selectedClassId && selectedClassId !== 'all' ? { classId: selectedClassId } : {}),
          ...(selectedSectionId && selectedSectionId !== 'all' ? { sectionId: selectedSectionId } : {}),
        }).toString();

        const endpoint = queryParams ? `/api/exam/list?${queryParams}` : '/api/exam/list';
        const examsRes = await api.get<any>(endpoint);
        let examList: ExamItem[] = Array.isArray(examsRes)
          ? examsRes
          : Array.isArray(examsRes?.data)
          ? examsRes.data
          : [];

        // Fallback: If section has no specific exams from /api/exam/list, check analytics exams
        if (examList.length === 0) {
          const analyticsRes = await api.get<any>('/api/mobile/v1/analytics').catch(() => null);
          const ongoing = analyticsRes?.data?.ongoingExams || [];
          const upcoming = analyticsRes?.data?.upcomingDeadlines || [];
          const recent = analyticsRes?.data?.recentExams || [];
          const map = new Map<string, ExamItem>();
          [...ongoing, ...upcoming, ...recent].forEach((e: any) => {
            if (e?.id && !map.has(e.id)) map.set(e.id, { id: e.id, name: e.name });
          });
          examList = Array.from(map.values());
        }

        setConfiguredExams(examList);

        // Keep previous exam if in list, otherwise select first available
        if (selectedExamId && examList.some((e) => e.id === selectedExamId)) {
          // Keep it
        } else if (examList.length > 0) {
          setSelectedExamId(examList[0].id);
        } else {
          setSelectedExamId(undefined);
        }
      } catch {
        setConfiguredExams([]);
      } finally {
        setIsLoadingExams(false);
      }
    })();
  }, [selectedClassId, selectedSectionId]);

  const selectedExam = useMemo(
    () => configuredExams.find((e) => e.id === selectedExamId),
    [configuredExams, selectedExamId]
  );

  // Handlers
  const handleSelectClass = (id: string) => {
    try {
      Haptics.selectionAsync();
    } catch {}
    setSelectedClassId(id);
    setSelectedSectionId('all');

    if (id === 'all') {
      setOpenSection('exam');
    } else {
      setOpenSection('section');
    }
  };

  const handleSelectSection = (id: string) => {
    try {
      Haptics.selectionAsync();
    } catch {}
    setSelectedSectionId(id);
    setOpenSection('exam');
  };

  const handleSelectExam = (id: string) => {
    try {
      Haptics.selectionAsync();
    } catch {}
    setSelectedExamId(id);
  };

  const handleApply = () => {
    if (!selectedExamId || !selectedExam) return;
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}

    const className = selectedClassId === 'all' ? 'Overall (All Classes)' : selectedClass?.name || 'Class';
    const sectionName =
      selectedClassId === 'all'
        ? 'Overall (All Sections)'
        : selectedSectionId === 'all'
        ? 'Overall (All Sections)'
        : selectedSection?.name || 'Section';

    onApply({
      examId: selectedExamId,
      examName: selectedExam.name,
      classId: selectedClassId,
      className,
      sectionId: selectedClassId === 'all' ? 'all' : selectedSectionId,
      sectionName,
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <SafeAreaView style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.sheetTitle}>Staff Analysis Filter</Text>
              <Text style={styles.sheetSubtitle}>1. Class ➔ 2. Section ➔ 3. Configured Exam</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {isLoadingClasses ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color="#6559FC" />
              <Text style={styles.loadingText}>Loading assigned classes...</Text>
            </View>
          ) : (
            <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
              {/* STEP 1: CLASS SELECTION */}
              <View style={styles.stepCard}>
                <TouchableOpacity
                  style={styles.stepCardHeader}
                  onPress={() => setOpenSection(openSection === 'class' ? 'section' : 'class')}
                  activeOpacity={0.7}
                >
                  <View style={styles.stepLeft}>
                    <View style={[styles.stepIconWrap, { backgroundColor: '#F0FDF4' }]}>
                      <GraduationCap size={18} color="#16A34A" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.stepLabel}>1. Select Class</Text>
                      <Text style={styles.stepSelectedValue} numberOfLines={1}>
                        {selectedClassId === 'all' ? '👑 Overall (All Classes)' : selectedClass?.name || 'Choose class'}
                      </Text>
                    </View>
                  </View>
                  <ChevronDown
                    size={18}
                    color="#94A3B8"
                    style={{ transform: [{ rotate: openSection === 'class' ? '180deg' : '0deg' }] }}
                  />
                </TouchableOpacity>

                {openSection === 'class' && (
                  <View style={styles.optionsList}>
                    {/* Overall All Classes Option */}
                    <TouchableOpacity
                      style={[styles.optionItem, selectedClassId === 'all' && styles.optionItemSelected]}
                      onPress={() => handleSelectClass('all')}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Sparkles size={16} color="#6559FC" style={{ marginRight: 8 }} />
                        <Text style={[styles.optionItemText, selectedClassId === 'all' && styles.optionItemTextSelected]}>
                          Overall (All Classes)
                        </Text>
                      </View>
                      {selectedClassId === 'all' && <Check size={16} color="#6559FC" />}
                    </TouchableOpacity>

                    {/* Specific Classes */}
                    {classes.map((cls) => {
                      const isSelected = cls.id === selectedClassId;
                      return (
                        <TouchableOpacity
                          key={cls.id}
                          style={[styles.optionItem, isSelected && styles.optionItemSelected]}
                          onPress={() => handleSelectClass(cls.id)}
                        >
                          <Text style={[styles.optionItemText, isSelected && styles.optionItemTextSelected]}>
                            {cls.name}
                          </Text>
                          {isSelected && <Check size={16} color="#6559FC" />}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>

              {/* STEP 2: SECTION SELECTION */}
              <View style={styles.stepCard}>
                <TouchableOpacity
                  style={styles.stepCardHeader}
                  onPress={() => setOpenSection(openSection === 'section' ? 'exam' : 'section')}
                  activeOpacity={0.7}
                  disabled={selectedClassId === 'all'}
                >
                  <View style={styles.stepLeft}>
                    <View style={[styles.stepIconWrap, { backgroundColor: '#FFFBEB' }]}>
                      <Users size={18} color="#D97706" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.stepLabel}>2. Select Section</Text>
                      <Text style={styles.stepSelectedValue} numberOfLines={1}>
                        {selectedClassId === 'all'
                          ? 'Included in Overall'
                          : selectedSectionId === 'all'
                          ? '✨ Overall (All Sections)'
                          : `Section ${selectedSection?.name || ''}`}
                      </Text>
                    </View>
                  </View>
                  {selectedClassId !== 'all' && (
                    <ChevronDown
                      size={18}
                      color="#94A3B8"
                      style={{ transform: [{ rotate: openSection === 'section' ? '180deg' : '0deg' }] }}
                    />
                  )}
                </TouchableOpacity>

                {openSection === 'section' && selectedClassId !== 'all' && (
                  <View style={styles.optionsList}>
                    {/* Guidance note about incharge privileges */}
                    <View style={styles.inchargeHintCard}>
                      <Crown size={14} color="#B45309" style={{ marginRight: 6 }} />
                      <Text style={styles.inchargeHintText}>
                        Sections marked with 👑 Incharge allow viewing all staff analytics.
                      </Text>
                    </View>

                    {/* Overall All Sections Option */}
                    <TouchableOpacity
                      style={[styles.optionItem, selectedSectionId === 'all' && styles.optionItemSelected]}
                      onPress={() => handleSelectSection('all')}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Sparkles size={16} color="#D97706" style={{ marginRight: 8 }} />
                        <Text style={[styles.optionItemText, selectedSectionId === 'all' && styles.optionItemTextSelected]}>
                          Overall (All Sections in Class)
                        </Text>
                      </View>
                      {selectedSectionId === 'all' && <Check size={16} color="#6559FC" />}
                    </TouchableOpacity>

                    {/* Specific Sections */}
                    {availableSections.length === 0 ? (
                      <Text style={styles.emptyText}>No sections mapped for this class.</Text>
                    ) : (
                      availableSections.map((sec) => {
                        const isSelected = sec.id === selectedSectionId;
                        return (
                          <TouchableOpacity
                            key={sec.id}
                            style={[styles.optionItem, isSelected && styles.optionItemSelected]}
                            onPress={() => handleSelectSection(sec.id)}
                          >
                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 8 }}>
                              <Text style={[styles.optionItemText, isSelected && styles.optionItemTextSelected]}>
                                Section {sec.name}
                              </Text>
                              {sec.isClassIncharge && (
                                <View style={styles.inchargeBadge}>
                                  <Text style={styles.inchargeBadgeText}>👑 Incharge</Text>
                                </View>
                              )}
                            </View>
                            {isSelected && <Check size={16} color="#6559FC" />}
                          </TouchableOpacity>
                        );
                      })
                    )}
                  </View>
                )}
              </View>

              {/* STEP 3: CONFIGURED EXAM SELECTION (Populated ONLY after section is selected) */}
              <View style={styles.stepCard}>
                <TouchableOpacity
                  style={styles.stepCardHeader}
                  onPress={() => setOpenSection(openSection === 'exam' ? 'class' : 'exam')}
                  activeOpacity={0.7}
                >
                  <View style={styles.stepLeft}>
                    <View style={[styles.stepIconWrap, { backgroundColor: '#EEF2FF' }]}>
                      <Award size={18} color="#6559FC" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.stepLabel}>3. Select Exam</Text>
                      <Text style={styles.stepSelectedValue} numberOfLines={1}>
                        {selectedExam?.name || 'Choose an exam'}
                      </Text>
                    </View>
                  </View>
                  <ChevronDown
                    size={18}
                    color="#94A3B8"
                    style={{ transform: [{ rotate: openSection === 'exam' ? '180deg' : '0deg' }] }}
                  />
                </TouchableOpacity>

                {openSection === 'exam' && (
                  <View style={styles.optionsList}>
                    {isLoadingExams ? (
                      <View style={styles.inlineLoadingBox}>
                        <ActivityIndicator size="small" color="#6559FC" />
                        <Text style={styles.inlineLoadingText}>
                          Fetching exams configured for this section...
                        </Text>
                      </View>
                    ) : configuredExams.length === 0 ? (
                      <View style={styles.noExamsBox}>
                        <Award size={24} color="#94A3B8" />
                        <Text style={styles.noExamsTitle}>No Exams Configured</Text>
                        <Text style={styles.noExamsSubtitle}>
                          There are no active exams configured for this section yet.
                        </Text>
                      </View>
                    ) : (
                      configuredExams.map((ex) => {
                        const isSelected = ex.id === selectedExamId;
                        return (
                          <TouchableOpacity
                            key={ex.id}
                            style={[styles.optionItem, isSelected && styles.optionItemSelected]}
                            onPress={() => handleSelectExam(ex.id)}
                          >
                            <Text style={[styles.optionItemText, isSelected && styles.optionItemTextSelected]}>
                              {ex.name}
                            </Text>
                            {isSelected && <Check size={16} color="#6559FC" />}
                          </TouchableOpacity>
                        );
                      })
                    )}
                  </View>
                )}
              </View>

              <View style={{ height: 20 }} />
            </ScrollView>
          )}

          {/* Bottom Action Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.applyBtn, (!selectedExamId || isLoadingClasses || isLoadingExams) && styles.applyBtnDisabled]}
              onPress={handleApply}
              disabled={!selectedExamId || isLoadingClasses || isLoadingExams}
            >
              <Filter size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.applyBtnText}>Apply Analytics Filter</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  sheetSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  loadingBox: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  scrollBody: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  stepCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
    overflow: 'hidden',
  },
  stepCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  stepLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  stepIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  stepSelectedValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
  optionsList: {
    paddingHorizontal: 14,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 6,
    paddingTop: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  optionItemSelected: {
    borderColor: '#6559FC',
    backgroundColor: '#F5F3FF',
  },
  optionItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  optionItemTextSelected: {
    color: '#6559FC',
    fontWeight: '800',
  },
  emptyText: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    paddingVertical: 12,
  },
  inchargeHintCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  inchargeHintText: {
    fontSize: 11,
    color: '#92400E',
    flex: 1,
    lineHeight: 15,
  },
  inchargeBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  inchargeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
  },
  inlineLoadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  inlineLoadingText: {
    fontSize: 12,
    color: '#6559FC',
    fontWeight: '600',
  },
  noExamsBox: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  noExamsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    marginTop: 6,
  },
  noExamsSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 2,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  applyBtn: {
    backgroundColor: '#6559FC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: '#6559FC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  applyBtnDisabled: {
    backgroundColor: '#94A3B8',
    shadowOpacity: 0,
    elevation: 0,
  },
  applyBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
