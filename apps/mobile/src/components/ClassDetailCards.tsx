import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  ChevronRight,
  ClipboardList,
  PenTool,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useAuth } from '../context/auth';
import { api } from '../lib/api';

export interface SectionItem {
  id?: string;
  name: string;
  isClassIncharge?: boolean;
  studentsCount?: number;
}

export interface ClassItem {
  id: string;
  name: string;
  studentsCount: number | null;
  isActive: boolean;
  sections: (string | SectionItem)[];
}

interface ClassDetailCardsProps {
  onRefreshStart?: () => void;
  onRefreshEnd?: () => void;
  searchQuery?: string;
  refreshTrigger?: number;
}

export function ClassDetailCards({
  onRefreshStart,
  onRefreshEnd,
  searchQuery = '',
  refreshTrigger = 0,
}: ClassDetailCardsProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const isWide = width >= 640;

  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Selected Section Quick Action Modal
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [selectedSectionIncharge, setSelectedSectionIncharge] = useState<boolean>(false);
  const [actionModalVisible, setActionModalVisible] = useState(false);

  // User-scoped cache key
  const storageKey = user?.id ? `@rexdeia_classes_${user.id}` : null;

  useEffect(() => {
    // Reset classes on user switch
    setClasses([]);
    if (!user?.id) {
      setIsLoading(false);
      return;
    }
    loadCachedClasses();
    fetchClasses();
  }, [user?.id, refreshTrigger]);

  const loadCachedClasses = async () => {
    if (!storageKey) return;
    try {
      const cached = await AsyncStorage.getItem(storageKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setClasses(parsed);
          setIsLoading(false);
        }
      }
    } catch {}
  };

  const fetchClasses = async () => {
    if (!user?.id) return;
    try {
      setIsLoading(true);
      onRefreshStart?.();
      const response = await api.get<{ data: ClassItem[] }>('/api/mobile/v1/classes');
      if (response && Array.isArray(response.data)) {
        setClasses(response.data);
        if (storageKey) {
          await AsyncStorage.setItem(storageKey, JSON.stringify(response.data));
        }
      } else {
        setClasses([]);
      }
    } catch (err: any) {
      if (err?.message !== 'SESSION_EXPIRED') {
        console.warn('Failed to fetch classes from API:', err);
      }
      setClasses([]);
    } finally {
      setIsLoading(false);
      onRefreshEnd?.();
    }
  };

  const handleSectionPress = async (
    cls: ClassItem,
    secName: string,
    isIncharge: boolean,
    secId?: string
  ) => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setSelectedClass(cls);
    setSelectedSection(secName);
    setSelectedSectionId(secId || null);
    setSelectedSectionIncharge(isIncharge);
    setActionModalVisible(true);
  };

  const filteredClasses = useMemo(() => {
    if (!searchQuery.trim()) return classes;
    const q = searchQuery.trim().toLowerCase();
    return classes.filter((c) => {
      const classNameMatches = c.name.toLowerCase().includes(q);
      const sectionMatches = c.sections.some((s) => {
        const name = typeof s === 'string' ? s : s.name;
        return name.toLowerCase().includes(q);
      });
      return classNameMatches || sectionMatches;
    });
  }, [classes, searchQuery]);

  return (
    <View style={styles.container}>
      {/* Loading State */}
      {isLoading && classes.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5C54F6" />
          <Text style={styles.loadingText}>Loading assigned classes...</Text>
        </View>
      ) : filteredClasses.length === 0 ? (
        /* Empty State */
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>
            {searchQuery ? 'No Classes Found' : 'No Data Available'}
          </Text>
          <Text style={styles.emptySubtitle}>
            {searchQuery
              ? `No classes or sections match "${searchQuery}"`
              : 'No classes or sections are available for your account.'}
          </Text>
        </View>
      ) : (
        /* Classes Grid */
        <View style={[styles.gridContainer, isWide && styles.gridContainerWide]}>
          {filteredClasses.map((classItem) => (
            <View
              key={classItem.id}
              style={[styles.classCard, isWide && styles.classCardWide]}
            >
              {/* Card Header: Class Name on left, Badges on right */}
              <View style={styles.cardHeader}>
                <Text style={styles.className}>{classItem.name}</Text>

                <View style={styles.badgesRow}>
                  {/* Students Badge (Yellow-100 pill, indigo text) */}
                  <View style={styles.studentsBadge}>
                    <Text style={styles.studentsBadgeText}>
                      Students: {classItem.studentsCount !== null ? classItem.studentsCount : '-'}
                    </Text>
                  </View>

                  {/* Active Badge (Mint/Teal pill, teal text) */}
                  {classItem.isActive ? (
                    <View style={styles.activeBadge}>
                      <Text style={styles.activeBadgeText}>Active</Text>
                    </View>
                  ) : null}
                </View>
              </View>

              {/* Sections Row: Section square buttons */}
              <View style={styles.sectionsRow}>
                {classItem.sections.map((secItem, idx) => {
                  const secName = typeof secItem === 'string' ? secItem : secItem.name;
                  const secId = typeof secItem === 'object' ? secItem.id : undefined;
                  const isIncharge = typeof secItem === 'object' && !!secItem.isClassIncharge;

                  return (
                    <TouchableOpacity
                      key={`${classItem.id}-${secName}-${idx}`}
                      style={[
                        styles.sectionButton,
                        isIncharge && styles.sectionButtonIncharge,
                      ]}
                      onPress={() => handleSectionPress(classItem, secName, isIncharge, secId)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.sectionButtonText}>{secName}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Quick Action Modal when tapping a Section */}
      <Modal
        visible={actionModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setActionModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setActionModalVisible(false)}
        >
          <View style={styles.actionSheet}>
            <View style={styles.actionSheetHeader}>
              <View>
                <View style={styles.sheetTitleRow}>
                  <Text style={styles.actionSheetTitle}>
                    Class {selectedClass?.name} - Section {selectedSection}
                  </Text>
                  {selectedSectionIncharge && (
                    <View style={styles.inchargeBadge}>
                      <ShieldCheck size={12} color="#059669" />
                      <Text style={styles.inchargeBadgeText}>Class Incharge</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.actionSheetSubtitle}>Select an action</Text>
              </View>
              <TouchableOpacity
                onPress={() => setActionModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.actionButtonsList}>
              <TouchableOpacity
                style={styles.actionRow}
                onPress={() => {
                  setActionModalVisible(false);
                  router.push('/(tabs)/attendance');
                }}
              >
                <View style={[styles.actionIconCircle, { backgroundColor: '#EEF2FF' }]}>
                  <ClipboardList size={20} color="#5C54F6" />
                </View>
                <View style={styles.actionTextContainer}>
                  <Text style={styles.actionRowTitle}>Mark Attendance</Text>
                  <Text style={styles.actionRowDesc}>Record daily student presence</Text>
                </View>
                <ChevronRight size={18} color="#CBD5E1" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionRow}
                onPress={() => {
                  setActionModalVisible(false);
                  router.push('/(tabs)/exams');
                }}
              >
                <View style={[styles.actionIconCircle, { backgroundColor: '#FDF4FF' }]}>
                  <PenTool size={20} color="#A855F7" />
                </View>
                <View style={styles.actionTextContainer}>
                  <Text style={styles.actionRowTitle}>Mark Entry</Text>
                  <Text style={styles.actionRowDesc}>Enter exam marks & grades</Text>
                </View>
                <ChevronRight size={18} color="#CBD5E1" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionRow}
                onPress={() => {
                  setActionModalVisible(false);
                  router.push({
                    pathname: '/(tabs)/students',
                    params: {
                      classId: selectedClass?.id,
                      className: selectedClass?.name,
                      sectionId: selectedSectionId || undefined,
                      sectionName: selectedSection || undefined,
                    },
                  });
                }}
              >
                <View style={[styles.actionIconCircle, { backgroundColor: '#ECFDF5' }]}>
                  <Users size={20} color="#10B981" />
                </View>
                <View style={styles.actionTextContainer}>
                  <Text style={styles.actionRowTitle}>Student List</Text>
                  <Text style={styles.actionRowDesc}>View students enrolled in this section</Text>
                </View>
                <ChevronRight size={18} color="#CBD5E1" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  gridContainer: {
    flexDirection: 'column',
    gap: 16,
  },
  gridContainerWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  classCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#C7D2FE',
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#5C54F6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    width: '100%',
  },
  classCardWide: {
    width: '48.5%',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  className: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: 0.2,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  studentsBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  studentsBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#3730A3',
  },
  activeBadge: {
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  activeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0D9488',
  },
  sectionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 7,
    marginTop: 4,
  },
  sectionButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#5C54F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionButtonIncharge: {
    backgroundColor: '#10B981', // Class Incharge Green
  },
  sectionButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  loadingContainer: {
    paddingVertical: 50,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  actionSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 36,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  actionSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sheetTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  actionSheetTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  inchargeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  inchargeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
  },
  actionSheetSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  actionButtonsList: {
    gap: 12,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  actionIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionRowTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  actionRowDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
});
