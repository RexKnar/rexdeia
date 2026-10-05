import * as Haptics from 'expo-haptics';
import {
  Award,
  Check,
  ChevronDown,
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

export interface StudentMarklistFilterResult {
  examId: string;
  examName: string;
  classId: string;
  className: string;
  sectionId: string;
  sectionName: string;
}

interface StudentMarklistFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: StudentMarklistFilterResult) => void;
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

export const StudentMarklistFilterModal: React.FC<StudentMarklistFilterModalProps> = ({
  visible,
  onClose,
  onApply,
  initialClassId,
  initialSectionId,
  initialExamId,
}) => {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [configuredExams, setConfiguredExams] = useState<ExamItem[]>([]);

  const [isLoadingClasses, setIsLoadingClasses] = useState(false);
  const [isLoadingExams, setIsLoadingExams] = useState(false);

  // STRICT REQUIREMENT: No default selections. User must explicitly choose Class, Section, then Exam.
  const [selectedClassId, setSelectedClassId] = useState<string | undefined>(initialClassId);
  const [selectedSectionId, setSelectedSectionId] = useState<string | undefined>(initialSectionId);
  const [selectedExamId, setSelectedExamId] = useState<string | undefined>(initialExamId);

  // Flow Order: class -> section -> exam
  const [openSection, setOpenSection] = useState<'class' | 'section' | 'exam'>(
    !initialClassId ? 'class' : !initialSectionId ? 'section' : 'exam'
  );

  // 1. Initial load: Fetch assigned classes for this staff
  useEffect(() => {
    if (!visible) return;

    if (!selectedClassId) {
      setOpenSection('class');
    } else if (!selectedSectionId) {
      setOpenSection('section');
    } else if (!selectedExamId) {
      setOpenSection('exam');
    }

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

  // 2. Fetch configured exams whenever sectionId changes
  useEffect(() => {
    if (!selectedClassId || !selectedSectionId) {
      setConfiguredExams([]);
      return;
    }

    (async () => {
      try {
        setIsLoadingExams(true);
        const queryParams = new URLSearchParams({
          classId: selectedClassId,
          sectionId: selectedSectionId,
        }).toString();

        const examsRes = await api.get<any>(`/api/exam/list?${queryParams}`);
        const examList: ExamItem[] = Array.isArray(examsRes)
          ? examsRes
          : Array.isArray(examsRes?.data)
          ? examsRes.data
          : [];

        setConfiguredExams(examList);

        // Clear exam selection if current exam is not in this section's exams
        if (selectedExamId && !examList.some((e) => e.id === selectedExamId)) {
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

  // Handlers following strict flow: Class -> Section -> Exam
  const handleSelectClass = (id: string) => {
    try {
      Haptics.selectionAsync();
    } catch {}
    setSelectedClassId(id);
    setSelectedSectionId(undefined); // Reset subsequent selections
    setSelectedExamId(undefined);
    setConfiguredExams([]);

    if (id === 'all') {
      setSelectedSectionId('all');
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
    setSelectedExamId(undefined); // Reset exam when section changes
    setOpenSection('exam');
  };

  const handleSelectExam = (id: string) => {
    try {
      Haptics.selectionAsync();
    } catch {}
    setSelectedExamId(id);
  };

  const isComplete = Boolean(selectedClassId && selectedSectionId && selectedExamId && selectedExam);

  const handleApply = () => {
    if (!isComplete || !selectedExam || !selectedClassId || !selectedSectionId) return;
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
      classId: selectedClassId,
      className,
      sectionId: selectedSectionId,
      sectionName,
      examId: selectedExam.id,
      examName: selectedExam.name,
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
              <Text style={styles.sheetTitle}>Choose Marklist Filters</Text>
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
              <View style={[styles.stepCard, !selectedClassId && styles.stepCardPending]}>
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
                      <Text
                        style={[
                          styles.stepSelectedValue,
                          !selectedClassId && styles.stepSelectedValuePlaceholder,
                        ]}
                        numberOfLines={1}
                      >
                        {selectedClassId === 'all'
                          ? '👑 Overall (All Classes)'
                          : selectedClass?.name || 'Tap to choose a class'}
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
                          Overall (All My Classes)
                        </Text>
                      </View>
                      {selectedClassId === 'all' && <Check size={16} color="#6559FC" />}
                    </TouchableOpacity>

                    {/* Specific Classes */}
                    {classes.length === 0 ? (
                      <Text style={styles.emptyText}>No assigned classes found.</Text>
                    ) : (
                      classes.map((cls) => {
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
                      })
                    )}
                  </View>
                )}
              </View>

              {/* STEP 2: SECTION SELECTION */}
              <View style={[styles.stepCard, !selectedSectionId && styles.stepCardPending]}>
                <TouchableOpacity
                  style={styles.stepCardHeader}
                  onPress={() => setOpenSection(openSection === 'section' ? 'exam' : 'section')}
                  activeOpacity={0.7}
                  disabled={!selectedClassId || selectedClassId === 'all'}
                >
                  <View style={styles.stepLeft}>
                    <View style={[styles.stepIconWrap, { backgroundColor: '#FFFBEB' }]}>
                      <Users size={18} color="#D97706" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.stepLabel}>2. Select Section</Text>
                      <Text
                        style={[
                          styles.stepSelectedValue,
                          !selectedSectionId && styles.stepSelectedValuePlaceholder,
                        ]}
                        numberOfLines={1}
                      >
                        {!selectedClassId
                          ? 'Select class first'
                          : selectedClassId === 'all'
                          ? 'Included in Overall'
                          : selectedSectionId === 'all'
                          ? '✨ Overall (All Sections in Class)'
                          : selectedSection
                          ? `Section ${selectedSection.name}`
                          : 'Tap to choose section'}
                      </Text>
                    </View>
                  </View>
                  {selectedClassId && selectedClassId !== 'all' && (
                    <ChevronDown
                      size={18}
                      color="#94A3B8"
                      style={{ transform: [{ rotate: openSection === 'section' ? '180deg' : '0deg' }] }}
                    />
                  )}
                </TouchableOpacity>

                {openSection === 'section' && selectedClassId && selectedClassId !== 'all' && (
                  <View style={styles.optionsList}>
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
                      <Text style={styles.emptyText}>No assigned sections found for this class.</Text>
                    ) : (
                      availableSections.map((sec) => {
                        const isSelected = sec.id === selectedSectionId;
                        return (
                          <TouchableOpacity
                            key={sec.id}
                            style={[styles.optionItem, isSelected && styles.optionItemSelected]}
                            onPress={() => handleSelectSection(sec.id)}
                          >
                            <Text style={[styles.optionItemText, isSelected && styles.optionItemTextSelected]}>
                              Section {sec.name}
                            </Text>
                            {isSelected && <Check size={16} color="#6559FC" />}
                          </TouchableOpacity>
                        );
                      })
                    )}
                  </View>
                )}
              </View>

              {/* STEP 3: CONFIGURED EXAM SELECTION (Populated ONLY after section is selected) */}
              <View style={[styles.stepCard, !selectedExamId && styles.stepCardPending]}>
                <TouchableOpacity
                  style={styles.stepCardHeader}
                  onPress={() => setOpenSection(openSection === 'exam' ? 'class' : 'exam')}
                  activeOpacity={0.7}
                  disabled={!selectedSectionId}
                >
                  <View style={styles.stepLeft}>
                    <View style={[styles.stepIconWrap, { backgroundColor: '#EEF2FF' }]}>
                      <Award size={18} color="#6559FC" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.stepLabel}>3. Select Exam</Text>
                      <Text
                        style={[
                          styles.stepSelectedValue,
                          !selectedExam && styles.stepSelectedValuePlaceholder,
                        ]}
                        numberOfLines={1}
                      >
                        {!selectedSectionId
                          ? 'Select section first'
                          : selectedExam?.name || 'Tap to choose an exam'}
                      </Text>
                    </View>
                  </View>
                  {selectedSectionId && (
                    <ChevronDown
                      size={18}
                      color="#94A3B8"
                      style={{ transform: [{ rotate: openSection === 'exam' ? '180deg' : '0deg' }] }}
                    />
                  )}
                </TouchableOpacity>

                {openSection === 'exam' && selectedSectionId && (
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
              style={[styles.applyBtn, !isComplete && styles.applyBtnDisabled]}
              onPress={handleApply}
              disabled={!isComplete || isLoadingClasses || isLoadingExams}
              activeOpacity={0.8}
            >
              <Filter size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.applyBtnText}>
                {!selectedClassId
                  ? '1. Please Choose Class'
                  : !selectedSectionId
                  ? '2. Please Choose Section'
                  : !selectedExamId
                  ? '3. Please Choose Exam'
                  : 'Apply Filters & View Marklist'}
              </Text>
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
  stepCardPending: {
    borderColor: '#CBD5E1',
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
  stepSelectedValuePlaceholder: {
    color: '#94A3B8',
    fontWeight: '500',
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
