import * as Haptics from 'expo-haptics';
import {
  Award,
  BookMarked,
  BookOpen,
  Check,
  Crown,
  Layers,
  Sparkles,
  X,
} from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../context/auth';
import { api } from '../lib/api';

export interface FilterResult {
  classId: string;
  className: string;
  sectionId: string;
  sectionName: string;
  examId: string;
  examName: string;
  subjectId?: string;
  subjectName?: string;
  isClassIncharge?: boolean;
  staffId?: string;
  staffName?: string;
}

interface MarkEntryFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterResult) => void;
  initialClassId?: string;
  initialSectionId?: string;
  initialExamId?: string;
  initialSubjectId?: string;
  initialStaffId?: string;
}

interface SectionItem {
  id: string;
  name: string;
  isClassIncharge?: boolean;
  studentsCount?: number;
}

interface ClassItem {
  id: string;
  name: string;
  isActive: boolean;
  sections?: SectionItem[];
}

interface ExamItem {
  id: string;
  name: string;
  isActive?: boolean;
  term?: { id: string; name: string };
  batch?: { id: string; name: string };
}

interface SubjectItem {
  id: string;
  name: string;
}

export const MarkEntryFilterModal: React.FC<MarkEntryFilterModalProps> = ({
  visible,
  onClose,
  onApply,
  initialClassId,
  initialSectionId,
  initialExamId,
  initialSubjectId,
  initialStaffId,
}) => {
  const { user } = useAuth();

  // Data lists
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [configuredExams, setConfiguredExams] = useState<ExamItem[]>([]);
  const [configuredSubjects, setConfiguredSubjects] = useState<SubjectItem[]>([]);

  // Selection states
  const [selectedClassId, setSelectedClassId] = useState<string | undefined>(initialClassId);
  const [selectedSectionId, setSelectedSectionId] = useState<string | undefined>(initialSectionId);
  const [selectedExamId, setSelectedExamId] = useState<string | undefined>(initialExamId);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | undefined>(initialSubjectId);

  // Loading states
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);
  const [isLoadingExams, setIsLoadingExams] = useState(false);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);

  // Initial load: Fetch classes
  useEffect(() => {
    if (!visible) return;

    (async () => {
      try {
        setIsLoadingClasses(true);
        const res = await api.get<{ data: ClassItem[] }>('/api/mobile/v1/classes');
        const classData = res?.data || [];
        setClasses(classData);

        // Keep initial or leave for user to choose
        if (initialClassId && classData.some((c) => c.id === initialClassId)) {
          setSelectedClassId(initialClassId);
          const matchedClass = classData.find((c) => c.id === initialClassId);
          if (initialSectionId && matchedClass?.sections?.some((s) => s.id === initialSectionId)) {
            setSelectedSectionId(initialSectionId);
          }
        }
      } catch {
        Alert.alert('Error', 'Failed to load classes.');
      } finally {
        setIsLoadingClasses(false);
      }
    })();
  }, [visible, initialClassId, initialSectionId]);

  // Selected class & sections
  const selectedClass = useMemo(
    () => classes.find((c) => c.id === selectedClassId),
    [classes, selectedClassId]
  );
  const currentSections = useMemo(
    () => selectedClass?.sections || [],
    [selectedClass]
  );
  const selectedSection = useMemo(
    () => currentSections.find((s) => s.id === selectedSectionId),
    [currentSections, selectedSectionId]
  );
  const isClassIncharge = Boolean(selectedSection?.isClassIncharge);

  // Fetch configured exams whenever selectedSectionId changes
  useEffect(() => {
    if (!selectedClassId || !selectedSectionId) {
      setConfiguredExams([]);
      setSelectedExamId(undefined);
      return;
    }

    (async () => {
      try {
        setIsLoadingExams(true);
        const examsRes = await api.get<any>(
          `/api/exam/list?classId=${selectedClassId}&sectionId=${selectedSectionId}`
        );

        let examList: ExamItem[] = [];
        if (Array.isArray(examsRes)) {
          examList = examsRes;
        } else if (examsRes?.data && Array.isArray(examsRes.data)) {
          examList = examsRes.data;
        }

        setConfiguredExams(examList);

        // If previous selectedExamId is in the list, keep it; else unset
        if (selectedExamId && !examList.some((e) => e.id === selectedExamId)) {
          setSelectedExamId(undefined);
        } else if (initialExamId && examList.some((e) => e.id === initialExamId)) {
          setSelectedExamId(initialExamId);
        }
      } catch {
        setConfiguredExams([]);
      } finally {
        setIsLoadingExams(false);
      }
    })();
  }, [selectedClassId, selectedSectionId]);

  // If user is class incharge and exam is selected: fetch subjects for this exam & section
  useEffect(() => {
    if (!isClassIncharge || !selectedExamId || !selectedSectionId) {
      setConfiguredSubjects([]);
      return;
    }

    (async () => {
      try {
        setIsLoadingSubjects(true);
        const configRes = await api.get<any[]>(`/api/exam/${selectedExamId}/config/all`);
        const allConfigs = Array.isArray(configRes) ? configRes : (configRes as any)?.data || [];

        // Filter subjects for the active section
        const sectionConfigs = allConfigs.filter(
          (c: any) => c.section?.id === selectedSectionId && c.subjectId && c.subjectName
        );

        // Deduplicate subjects
        const map = new Map<string, string>();
        sectionConfigs.forEach((sc: any) => {
          map.set(sc.subjectId, sc.subjectName);
        });

        const subjectList: SubjectItem[] = Array.from(map.entries()).map(([id, name]) => ({
          id,
          name,
        }));

        setConfiguredSubjects(subjectList);
      } catch {
        setConfiguredSubjects([]);
      } finally {
        setIsLoadingSubjects(false);
      }
    })();
  }, [isClassIncharge, selectedExamId, selectedSectionId]);

  // Handler: Class Change
  const handleSelectClass = (classId: string) => {
    if (selectedClassId === classId) return;
    try {
      Haptics.selectionAsync();
    } catch {}

    setSelectedClassId(classId);
    // Reset downstream selections
    setSelectedSectionId(undefined);
    setSelectedExamId(undefined);
    setSelectedSubjectId(undefined);
    setConfiguredExams([]);
    setConfiguredSubjects([]);
  };

  // Handler: Section Change
  const handleSelectSection = (sectionId: string) => {
    if (selectedSectionId === sectionId) return;
    try {
      Haptics.selectionAsync();
    } catch {}

    setSelectedSectionId(sectionId);
    // Reset downstream selections
    setSelectedExamId(undefined);
    setSelectedSubjectId(undefined);
    setConfiguredSubjects([]);
  };

  // Handler: Exam Change
  const handleSelectExam = (examId: string) => {
    try {
      Haptics.selectionAsync();
    } catch {}

    setSelectedExamId(examId);
    setSelectedSubjectId(undefined);
  };

  // Handler: Subject Change
  const handleSelectSubject = (subjectId?: string) => {
    try {
      Haptics.selectionAsync();
    } catch {}

    setSelectedSubjectId(subjectId);
  };

  // Check if form is ready to apply
  const isReadyToApply = Boolean(selectedClassId && selectedSectionId && selectedExamId);

  // Handler: Apply Filters
  const handleApply = () => {
    if (!isReadyToApply || !selectedClass || !selectedSection) {
      Alert.alert('Incomplete Selection', 'Please select Class, Section, and Exam to proceed.');
      return;
    }

    const exm = configuredExams.find((e) => e.id === selectedExamId);
    const selectedSub = configuredSubjects.find((s) => s.id === selectedSubjectId);

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}

    onApply({
      classId: selectedClass.id,
      className: selectedClass.name,
      sectionId: selectedSection.id,
      sectionName: selectedSection.name,
      examId: selectedExamId!,
      examName: exm?.name || 'Exam',
      subjectId: selectedSubjectId,
      subjectName: selectedSub?.name,
      isClassIncharge,
      staffId: initialStaffId,
    });

    onClose();
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.modalContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <X size={20} color="#475569" />
          </TouchableOpacity>
          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTitle}>Mark Entry Filter</Text>
            <Text style={styles.headerSub}>Select class details step-by-step</Text>
          </View>
          <TouchableOpacity
            style={[styles.applyTopBtn, !isReadyToApply && styles.applyTopBtnDisabled]}
            onPress={handleApply}
            disabled={!isReadyToApply}
          >
            <Text style={[styles.applyTopBtnText, !isReadyToApply && styles.applyTopBtnTextDisabled]}>
              Apply
            </Text>
          </TouchableOpacity>
        </View>

        {isLoadingClasses ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#6559FC" />
            <Text style={styles.loadingText}>Loading filter options...</Text>
          </View>
        ) : (
          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* STEP 1: CLASS SELECTION (Always Visible) */}
            <View style={styles.stepSection}>
              <View style={styles.stepHeaderRow}>
                <View style={[styles.stepNumberBadge, selectedClassId ? styles.stepNumberBadgeDone : null]}>
                  <Text style={[styles.stepNumberText, selectedClassId ? styles.stepNumberTextDone : null]}>
                    1
                  </Text>
                </View>
                <View style={styles.stepTitleCol}>
                  <Text style={styles.stepTitle}>Select Class</Text>
                  <Text style={styles.stepDesc}>Choose the academic class to grade</Text>
                </View>
              </View>

              {classes.length === 0 ? (
                <View style={styles.emptyStateBox}>
                  <Text style={styles.emptyStateText}>No assigned classes found for your account.</Text>
                </View>
              ) : (
                <View style={styles.chipsWrap}>
                  {classes.map((cls) => {
                    const isSelected = cls.id === selectedClassId;
                    return (
                      <TouchableOpacity
                        key={cls.id}
                        style={[styles.choiceChip, isSelected && styles.choiceChipActive]}
                        onPress={() => handleSelectClass(cls.id)}
                        activeOpacity={0.7}
                      >
                        <BookOpen
                          size={15}
                          color={isSelected ? '#FFFFFF' : '#6559FC'}
                          style={{ marginRight: 6 }}
                        />
                        <Text style={[styles.choiceChipText, isSelected && styles.choiceChipTextActive]}>
                          {cls.name}
                        </Text>
                        {isSelected && <Check size={14} color="#FFFFFF" style={{ marginLeft: 6 }} />}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>

            {/* STEP 2: SECTION SELECTION (Visible ONLY when Class is chosen) */}
            {Boolean(selectedClassId) && (
              <View style={styles.stepSection}>
                <View style={styles.stepHeaderRow}>
                  <View style={[styles.stepNumberBadge, selectedSectionId ? styles.stepNumberBadgeDone : null]}>
                    <Text style={[styles.stepNumberText, selectedSectionId ? styles.stepNumberTextDone : null]}>
                      2
                    </Text>
                  </View>
                  <View style={styles.stepTitleCol}>
                    <Text style={styles.stepTitle}>Select Section</Text>
                    <Text style={styles.stepDesc}>Available sections for {selectedClass?.name}</Text>
                  </View>
                </View>

                {currentSections.length === 0 ? (
                  <View style={styles.emptyStateBox}>
                    <Text style={styles.emptyStateText}>No sections mapped to this class.</Text>
                  </View>
                ) : (
                  <View style={styles.chipsWrap}>
                    {currentSections.map((sec) => {
                      const isSelected = sec.id === selectedSectionId;
                      const incharge = Boolean(sec.isClassIncharge);
                      return (
                        <TouchableOpacity
                          key={sec.id}
                          style={[
                            styles.choiceChip,
                            isSelected && styles.choiceChipActive,
                            incharge && !isSelected && styles.choiceChipIncharge,
                          ]}
                          onPress={() => handleSelectSection(sec.id)}
                          activeOpacity={0.7}
                        >
                          <Layers
                            size={15}
                            color={isSelected ? '#FFFFFF' : incharge ? '#7C3AED' : '#475569'}
                            style={{ marginRight: 6 }}
                          />
                          <Text style={[styles.choiceChipText, isSelected && styles.choiceChipTextActive]}>
                            Section {sec.name}
                          </Text>
                          {incharge && (
                            <View
                              style={[
                                styles.inchargeTag,
                                isSelected && { backgroundColor: 'rgba(255,255,255,0.25)' },
                              ]}
                            >
                              <Crown size={10} color={isSelected ? '#FFFFFF' : '#7C3AED'} />
                              <Text
                                style={[
                                  styles.inchargeTagText,
                                  isSelected && { color: '#FFFFFF' },
                                ]}
                              >
                                Incharge
                              </Text>
                            </View>
                          )}
                          {isSelected && <Check size={14} color="#FFFFFF" style={{ marginLeft: 6 }} />}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            )}

            {/* STEP 3: CONFIGURED EXAM SELECTION (Visible ONLY after Section is chosen) */}
            {Boolean(selectedSectionId) && (
              <View style={styles.stepSection}>
                <View style={styles.stepHeaderRow}>
                  <View style={[styles.stepNumberBadge, selectedExamId ? styles.stepNumberBadgeDone : null]}>
                    <Text style={[styles.stepNumberText, selectedExamId ? styles.stepNumberTextDone : null]}>
                      3
                    </Text>
                  </View>
                  <View style={styles.stepTitleCol}>
                    <Text style={styles.stepTitle}>Select Configured Exam</Text>
                    <Text style={styles.stepDesc}>Exams configured for Section {selectedSection?.name}</Text>
                  </View>
                </View>

                {isLoadingExams ? (
                  <View style={styles.loadingInnerBox}>
                    <ActivityIndicator size="small" color="#6559FC" />
                    <Text style={styles.loadingInnerBoxText}>Loading configured exams...</Text>
                  </View>
                ) : configuredExams.length === 0 ? (
                  <View style={styles.emptyStateBox}>
                    <Text style={styles.emptyStateText}>
                      No exams configured for Class {selectedClass?.name} - Section {selectedSection?.name}.
                    </Text>
                  </View>
                ) : (
                  <View style={styles.examCardsList}>
                    {configuredExams.map((ex) => {
                      const isSelected = ex.id === selectedExamId;
                      return (
                        <TouchableOpacity
                          key={ex.id}
                          style={[styles.examOptionCard, isSelected && styles.examOptionCardActive]}
                          onPress={() => handleSelectExam(ex.id)}
                          activeOpacity={0.7}
                        >
                          <View style={styles.examOptionIconCircle}>
                            <Award size={18} color={isSelected ? '#FFFFFF' : '#6559FC'} />
                          </View>
                          <View style={styles.examOptionTextCol}>
                            <Text
                              style={[styles.examOptionTitle, isSelected && styles.examOptionTitleActive]}
                            >
                              {ex.name}
                            </Text>
                            {ex.term?.name && (
                              <Text style={styles.examOptionSub}>
                                {ex.term.name} {ex.batch?.name ? `• ${ex.batch.name}` : ''}
                              </Text>
                            )}
                          </View>
                          <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
                            {isSelected && <View style={styles.radioDot} />}
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            )}

            {/* STEP 4: SUBJECT SELECTION (Visible ONLY if logged in user is Class Incharge) */}
            {Boolean(selectedExamId && isClassIncharge) && (
              <View style={styles.stepSection}>
                <View style={styles.stepHeaderRow}>
                  <View style={[styles.stepNumberBadge, styles.stepNumberBadgeIncharge]}>
                    <Crown size={12} color="#FFFFFF" />
                  </View>
                  <View style={styles.stepTitleCol}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={styles.stepTitle}>Select Subject</Text>
                      <View style={styles.inchargePill}>
                        <Text style={styles.inchargePillText}>Class Incharge</Text>
                      </View>
                    </View>
                    <Text style={styles.stepDesc}>
                      You have incharge access to grade any subject in this section.
                    </Text>
                  </View>
                </View>

                {isLoadingSubjects ? (
                  <View style={styles.loadingInnerBox}>
                    <ActivityIndicator size="small" color="#7C3AED" />
                    <Text style={styles.loadingInnerBoxText}>Loading section subjects...</Text>
                  </View>
                ) : (
                  <View style={styles.chipsWrap}>
                    {/* "All Subjects" option */}
                    <TouchableOpacity
                      style={[
                        styles.choiceChip,
                        !selectedSubjectId && styles.choiceChipActive,
                      ]}
                      onPress={() => handleSelectSubject(undefined)}
                      activeOpacity={0.7}
                    >
                      <Sparkles
                        size={14}
                        color={!selectedSubjectId ? '#FFFFFF' : '#6559FC'}
                        style={{ marginRight: 6 }}
                      />
                      <Text
                        style={[
                          styles.choiceChipText,
                          !selectedSubjectId && styles.choiceChipTextActive,
                        ]}
                      >
                        All Subjects
                      </Text>
                      {!selectedSubjectId && (
                        <Check size={14} color="#FFFFFF" style={{ marginLeft: 6 }} />
                      )}
                    </TouchableOpacity>

                    {/* Configured subjects */}
                    {configuredSubjects.map((sub) => {
                      const isSelected = sub.id === selectedSubjectId;
                      return (
                        <TouchableOpacity
                          key={sub.id}
                          style={[styles.choiceChip, isSelected && styles.choiceChipActive]}
                          onPress={() => handleSelectSubject(sub.id)}
                          activeOpacity={0.7}
                        >
                          <BookMarked
                            size={14}
                            color={isSelected ? '#FFFFFF' : '#475569'}
                            style={{ marginRight: 6 }}
                          />
                          <Text
                            style={[styles.choiceChipText, isSelected && styles.choiceChipTextActive]}
                          >
                            {sub.name}
                          </Text>
                          {isSelected && <Check size={14} color="#FFFFFF" style={{ marginLeft: 6 }} />}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            )}

            <View style={{ height: 40 }} />
          </ScrollView>
        )}

        {/* Footer Apply Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.applyBtn, !isReadyToApply && styles.applyBtnDisabled]}
            onPress={handleApply}
            disabled={!isReadyToApply}
            activeOpacity={0.8}
          >
            <Text style={[styles.applyBtnText, !isReadyToApply && styles.applyBtnTextDisabled]}>
              {isReadyToApply ? 'Apply Filters & View Students' : 'Complete Selection to Proceed'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleCol: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  applyTopBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
  },
  applyTopBtnDisabled: {
    backgroundColor: '#F1F5F9',
  },
  applyTopBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6559FC',
  },
  applyTopBtnTextDisabled: {
    color: '#94A3B8',
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
  scrollContent: {
    flex: 1,
    padding: 16,
  },
  stepSection: {
    marginBottom: 26,
  },
  stepHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  stepNumberBadgeDone: {
    backgroundColor: '#6559FC',
  },
  stepNumberBadgeIncharge: {
    backgroundColor: '#7C3AED',
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6559FC',
  },
  stepNumberTextDone: {
    color: '#FFFFFF',
  },
  stepTitleCol: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  stepDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  inchargePill: {
    marginLeft: 8,
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  inchargePillText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#7C3AED',
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  choiceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  choiceChipActive: {
    backgroundColor: '#6559FC',
    borderColor: '#6559FC',
  },
  choiceChipIncharge: {
    backgroundColor: '#FAF5FF',
    borderColor: '#E9D5FF',
  },
  choiceChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  choiceChipTextActive: {
    color: '#FFFFFF',
  },
  inchargeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 6,
    gap: 3,
  },
  inchargeTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#7C3AED',
  },
  examCardsList: {
    gap: 10,
  },
  examOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  examOptionCardActive: {
    backgroundColor: '#F5F3FF',
    borderColor: '#6559FC',
  },
  examOptionIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  examOptionTextCol: {
    flex: 1,
  },
  examOptionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  examOptionTitleActive: {
    color: '#6559FC',
    fontWeight: '700',
  },
  examOptionSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: '#6559FC',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6559FC',
  },
  emptyStateBox: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },
  loadingInnerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 10,
  },
  loadingInnerBoxText: {
    fontSize: 13,
    color: '#64748B',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  applyBtn: {
    backgroundColor: '#6559FC',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnDisabled: {
    backgroundColor: '#E2E8F0',
  },
  applyBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  applyBtnTextDisabled: {
    color: '#94A3B8',
  },
});
