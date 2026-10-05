import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Check,
  Filter,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Users,
  X,
} from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ClassItem, SectionItem } from '../../src/components/ClassDetailCards';
import { useAuth } from '../../src/context/auth';
import { api } from '../../src/lib/api';

export interface StudentItem {
  id: string;
  mappingId?: string;
  name: string;
  firstName?: string;
  lastName?: string;
  rollNo: string;
  classId: string;
  className: string;
  sectionId: string;
  sectionName: string;
  status: 'Active' | 'Inactive';
  gender?: string;
  emisNumber?: string;
  phoneNumber?: string | null;
  profileImage?: string | null;
}

export default function StudentsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams<{
    classId?: string;
    className?: string;
    sectionId?: string;
    sectionName?: string;
  }>();

  // Core Data State
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassId, setSelectedClassId] = useState<string | null>(
    params.classId || null
  );
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    params.sectionId || null
  );

  // Temporary state for the filter modal
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [modalClassId, setModalClassId] = useState<string | null>(selectedClassId);
  const [modalSectionId, setModalSectionId] = useState<string | null>(selectedSectionId);

  // Cache key scoped to the logged-in user
  const cacheKey = user?.id ? `@rexdeia_students_${user.id}` : null;

  // Reset state on user switch / logout
  useEffect(() => {
    setStudents([]);
    setClasses([]);
    setErrorMessage(null);
  }, [user?.id]);

  // Load cached students on initial mount
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

  // Fetch classes for filter dropdown
  const fetchClasses = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await api.get<{ data: ClassItem[] }>('/api/mobile/v1/classes');
      if (res && Array.isArray(res.data)) {
        setClasses(res.data);
      }
    } catch (err: any) {
      if (err?.message !== 'SESSION_EXPIRED') {
        console.warn('Failed to load classes for filter:', err);
      }
    }
  }, [user?.id]);

  // Fetch students from API
  const fetchStudents = useCallback(
    async (showLoadingSpinner = true) => {
      if (!user?.id) {
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }
      if (showLoadingSpinner) {
        setIsLoading(true);
      }
      setErrorMessage(null);

      try {
        const queryParams = new URLSearchParams();
        if (selectedClassId) queryParams.set('classId', selectedClassId);
        if (selectedSectionId) queryParams.set('sectionId', selectedSectionId);

        const url = `/api/mobile/v1/students${
          queryParams.toString() ? `?${queryParams.toString()}` : ''
        }`;

        const res = await api.get<{ success: boolean; data: StudentItem[] }>(url);
        if (res && Array.isArray(res.data)) {
          setStudents(res.data);
          if (cacheKey && !selectedClassId && !selectedSectionId) {
            await AsyncStorage.setItem(cacheKey, JSON.stringify(res.data));
          }
        } else {
          setStudents([]);
        }
      } catch (err: any) {
        if (err?.message !== 'SESSION_EXPIRED') {
          console.warn('Failed to fetch students:', err);
          setErrorMessage(
            err?.message || 'Failed to load students. Please check your connection.'
          );
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [user?.id, cacheKey, selectedClassId, selectedSectionId]
  );

  // Trigger initial fetches and refetch when selectedClassId or selectedSectionId changes
  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  useEffect(() => {
    fetchStudents(true);
  }, [fetchStudents]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchStudents(false), fetchClasses()]);
  };

  // Sections available in the filter modal based on chosen modal class
  const availableModalSections = useMemo(() => {
    if (!modalClassId) return [];
    const foundClass = classes.find((c) => c.id === modalClassId);
    if (!foundClass) return [];
    return foundClass.sections;
  }, [classes, modalClassId]);

  // Active filter names for display
  const selectedClassName = useMemo(() => {
    if (!selectedClassId) return null;
    const found = classes.find((c) => c.id === selectedClassId);
    return found?.name || params.className || 'Selected Class';
  }, [classes, selectedClassId, params.className]);

  const selectedSectionName = useMemo(() => {
    if (!selectedSectionId) return null;
    for (const c of classes) {
      for (const s of c.sections) {
        if (typeof s === 'object' && s.id === selectedSectionId) {
          return s.name;
        }
      }
    }
    return params.sectionName || 'Selected Section';
  }, [classes, selectedSectionId, params.sectionName]);

  const activeFiltersCount = (selectedClassId ? 1 : 0) + (selectedSectionId ? 1 : 0);

  // Client-side search filtering
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    const q = searchQuery.trim().toLowerCase();
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.rollNo.toLowerCase().includes(q) ||
        s.className.toLowerCase().includes(q) ||
        s.sectionName.toLowerCase().includes(q) ||
        (s.emisNumber && s.emisNumber.toLowerCase().includes(q))
    );
  }, [students, searchQuery]);

  // Filter Modal Controls
  const openFilterModal = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setModalClassId(selectedClassId);
    setModalSectionId(selectedSectionId);
    setIsFilterModalVisible(true);
  };

  const applyFilters = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    setSelectedClassId(modalClassId);
    setSelectedSectionId(modalSectionId);
    setIsFilterModalVisible(false);
  };

  const resetFilters = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setModalClassId(null);
    setModalSectionId(null);
    setSelectedClassId(null);
    setSelectedSectionId(null);
    setIsFilterModalVisible(false);
  };

  const clearClassFilter = () => {
    setSelectedClassId(null);
    setSelectedSectionId(null);
  };

  const clearSectionFilter = () => {
    setSelectedSectionId(null);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top Navigation Header */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.push('/(tabs)/analytics');
            }
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={22} color="#0F172A" />
        </TouchableOpacity>

        <View style={styles.navTitleContainer}>
          <Text style={styles.navTitle}>Student List</Text>
          <Text style={styles.navSubtitle}>
            {selectedClassName
              ? `${selectedClassName}${selectedSectionName ? ` - Section ${selectedSectionName}` : ''}`
              : 'All Assigned Classes'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.refreshIconBtn}
          onPress={handleRefresh}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <RefreshCw size={18} color="#64748B" />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        {/* Search & Filter Trigger Bar */}
        <View style={styles.searchFilterRow}>
          <View style={styles.searchBox}>
            <Search size={18} color="#94A3B8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name, roll no..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
            {searchQuery ? (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <X size={16} color="#94A3B8" />
              </TouchableOpacity>
            ) : null}
          </View>

          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFiltersCount > 0 && styles.filterButtonActive,
            ]}
            onPress={openFilterModal}
            activeOpacity={0.8}
          >
            <SlidersHorizontal
              size={18}
              color={activeFiltersCount > 0 ? '#FFFFFF' : '#6559FC'}
            />
            {activeFiltersCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Active Filter Pills Bar */}
        {activeFiltersCount > 0 && (
          <View style={styles.activePillsRow}>
            {selectedClassName && (
              <View style={styles.activePill}>
                <Text style={styles.activePillText}>Class {selectedClassName}</Text>
                <TouchableOpacity
                  onPress={clearClassFilter}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                >
                  <X size={14} color="#4F46E5" />
                </TouchableOpacity>
              </View>
            )}

            {selectedSectionName && (
              <View style={styles.activePill}>
                <Text style={styles.activePillText}>Section {selectedSectionName}</Text>
                <TouchableOpacity
                  onPress={clearSectionFilter}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                >
                  <X size={14} color="#4F46E5" />
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity onPress={resetFilters} style={styles.clearAllBtn}>
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Students Count Header */}
        {!isLoading && !errorMessage && (
          <View style={styles.countRow}>
            <Text style={styles.countText}>
              Showing <Text style={styles.countHighlight}>{filteredStudents.length}</Text>{' '}
              {filteredStudents.length === 1 ? 'student' : 'students'}
            </Text>
          </View>
        )}

        {/* Main Content Area */}
        {isLoading && students.length === 0 ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#6559FC" />
            <Text style={styles.loadingText}>Loading students from server...</Text>
          </View>
        ) : errorMessage && students.length === 0 ? (
          <View style={styles.centerContainer}>
            <View style={styles.errorIconCircle}>
              <Users size={28} color="#EF4444" />
            </View>
            <Text style={styles.errorTitle}>Unable to load students</Text>
            <Text style={styles.errorSubtitle}>{errorMessage}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => fetchStudents(true)}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredStudents}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                colors={['#6559FC']}
                tintColor="#6559FC"
              />
            }
            renderItem={({ item }) => {
              const initial = item.name ? item.name.charAt(0).toUpperCase() : '?';
              return (
                <TouchableOpacity
                  style={styles.studentCard}
                  activeOpacity={0.75}
                  onPress={() => {
                    try {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    } catch {}
                    router.push(`/student/${item.id}` as any);
                  }}
                >
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{initial}</Text>
                  </View>

                  <View style={styles.studentInfo}>
                    <View style={styles.nameRow}>
                      <Text style={styles.studentName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      {item.status === 'Active' ? (
                        <View style={styles.statusActiveBadge}>
                          <Text style={styles.statusActiveText}>Active</Text>
                        </View>
                      ) : (
                        <View style={styles.statusInactiveBadge}>
                          <Text style={styles.statusInactiveText}>{item.status}</Text>
                        </View>
                      )}
                    </View>

                    <Text style={styles.rollNo}>
                      Roll No: {item.rollNo || '-'}
                      {item.sectionName ? ` • Sec ${item.sectionName}` : ''}
                    </Text>

                    {item.emisNumber ? (
                      <Text style={styles.metaText}>EMIS: {item.emisNumber}</Text>
                    ) : null}
                  </View>

                  <View style={styles.classBadge}>
                    <Text style={styles.classBadgeText}>
                      {item.className ? `Class ${item.className}` : '-'}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconCircle}>
                  <Users size={32} color="#94A3B8" />
                </View>
                <Text style={styles.emptyTitle}>No Students Found</Text>
                <Text style={styles.emptySubtitle}>
                  {activeFiltersCount > 0 || searchQuery
                    ? 'No students match your selected filters or search keyword.'
                    : 'No student records available for this academic year.'}
                </Text>
                {(activeFiltersCount > 0 || searchQuery) && (
                  <TouchableOpacity
                    style={styles.emptyResetBtn}
                    onPress={() => {
                      setSearchQuery('');
                      resetFilters();
                    }}
                  >
                    <Text style={styles.emptyResetBtnText}>Reset All Filters</Text>
                  </TouchableOpacity>
                )}
              </View>
            }
          />
        )}
      </View>

      {/* Filter Modal */}
      <Modal
        visible={isFilterModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsFilterModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setIsFilterModalVisible(false)}
        >
          <View style={styles.modalCard} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Filter Students</Text>
                <Text style={styles.modalSubtitle}>Filter by class and section</Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsFilterModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Select Class */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Class</Text>
              <View style={styles.chipsWrap}>
                <TouchableOpacity
                  style={[
                    styles.chip,
                    modalClassId === null && styles.chipActive,
                  ]}
                  onPress={() => {
                    setModalClassId(null);
                    setModalSectionId(null);
                  }}
                >
                  <Text
                    style={[
                      styles.chipText,
                      modalClassId === null && styles.chipTextActive,
                    ]}
                  >
                    All Classes
                  </Text>
                </TouchableOpacity>

                {classes.map((c) => (
                  <TouchableOpacity
                    key={c.id}
                    style={[
                      styles.chip,
                      modalClassId === c.id && styles.chipActive,
                    ]}
                    onPress={() => {
                      setModalClassId(c.id);
                      setModalSectionId(null); // Reset section when changing class
                    }}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        modalClassId === c.id && styles.chipTextActive,
                      ]}
                    >
                      Class {c.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Select Section (if a class is selected) */}
            {modalClassId && availableModalSections.length > 0 && (
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Section</Text>
                <View style={styles.chipsWrap}>
                  <TouchableOpacity
                    style={[
                      styles.chip,
                      modalSectionId === null && styles.chipActive,
                    ]}
                    onPress={() => setModalSectionId(null)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        modalSectionId === null && styles.chipTextActive,
                      ]}
                    >
                      All Sections
                    </Text>
                  </TouchableOpacity>

                  {availableModalSections.map((secItem, idx) => {
                    const secName =
                      typeof secItem === 'string' ? secItem : secItem.name;
                    const secId =
                      typeof secItem === 'object' ? secItem.id : secName;

                    return (
                      <TouchableOpacity
                        key={`${secName}-${idx}`}
                        style={[
                          styles.chip,
                          modalSectionId === secId && styles.chipActive,
                        ]}
                        onPress={() => setModalSectionId(secId || null)}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            modalSectionId === secId && styles.chipTextActive,
                          ]}
                        >
                          Section {secName}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Modal Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalResetBtn}
                onPress={() => {
                  setModalClassId(null);
                  setModalSectionId(null);
                }}
              >
                <Text style={styles.modalResetText}>Reset</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalApplyBtn}
                onPress={applyFilters}
              >
                <Text style={styles.modalApplyText}>Apply Filter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    padding: 6,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  navTitleContainer: {
    flex: 1,
  },
  navTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  navSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  refreshIconBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  searchFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#0F172A',
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  filterButtonActive: {
    backgroundColor: '#6559FC',
    borderColor: '#6559FC',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  filterBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  activePillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  activePillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
  },
  clearAllBtn: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  clearAllText: {
    fontSize: 12,
    color: '#64748B',
    textDecorationLine: 'underline',
  },
  countRow: {
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  countText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  countHighlight: {
    fontWeight: '700',
    color: '#0F172A',
  },
  listContent: {
    paddingBottom: 32,
    gap: 10,
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6559FC',
  },
  studentInfo: {
    flex: 1,
    marginRight: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  studentName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
    flexShrink: 1,
  },
  statusActiveBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  statusActiveText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  statusInactiveBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  statusInactiveText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  rollNo: {
    fontSize: 12,
    color: '#64748B',
  },
  metaText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  classBadge: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  classBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
  },
  errorIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  errorSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 32,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#6559FC',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  emptyResetBtn: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  emptyResetBtnText: {
    color: '#6559FC',
    fontWeight: '600',
    fontSize: 13,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 36,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  filterSection: {
    marginBottom: 18,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipActive: {
    backgroundColor: '#6559FC',
    borderColor: '#6559FC',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#475569',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
  },
  modalResetBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalResetText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  modalApplyBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6559FC',
  },
  modalApplyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
