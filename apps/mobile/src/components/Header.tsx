import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  Calendar,
  ChevronRight,
  GraduationCap,
  LogOut,
  School,
  Search,
  User,
  Users,
  Wifi,
  WifiOff,
  X,
} from 'lucide-react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Dimensions,
  Image,
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/auth';
import { useNetworkSync } from '../context/network-sync';
import { api } from '../lib/api';

export interface StudentSuggestionItem {
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
  status?: string;
  profileImage?: string | null;
}

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  variant?: 'light' | 'dark';
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearch?: (query: string) => void;
}

export function Header({
  searchPlaceholder = 'Search students by name, roll no, class...',
  searchValue,
  onSearch,
}: HeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { isOnline } = useNetworkSync();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [internalQuery, setInternalQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Cached and live fetched student suggestions
  const [cachedStudents, setCachedStudents] = useState<StudentSuggestionItem[]>([]);
  const [liveStudents, setLiveStudents] = useState<StudentSuggestionItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchDebounceRef = useRef<any>(null);
  const searchInputRef = useRef<TextInput | null>(null);

  const query = searchValue !== undefined ? searchValue : internalQuery;

  // Organization name & academic year from active session
  const organizationName = user?.organizationName || 'Rexdeia Academy';
  const academicYear = user?.academicYear || '2024-2025';

  // Load cached students for instant zero-latency filtering
  useEffect(() => {
    if (!user?.id) {
      setCachedStudents([]);
      return;
    }
    let isMounted = true;
    (async () => {
      try {
        const studentsStr = await AsyncStorage.getItem(`@rexdeia_students_${user.id}`);
        if (studentsStr && isMounted) {
          const parsed = JSON.parse(studentsStr);
          if (Array.isArray(parsed)) setCachedStudents(parsed);
        }
      } catch {}
    })();
    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  // Debounced search query fetch to API
  useEffect(() => {
    const q = query.trim();
    if (!q || !isSearchOpen) {
      setLiveStudents([]);
      setIsSearching(false);
      return;
    }

    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    searchDebounceRef.current = setTimeout(async () => {
      try {
        setIsSearching(true);
        const res = await api.get<{ success: boolean; data: StudentSuggestionItem[] }>(
          `/api/mobile/v1/students?search=${encodeURIComponent(q)}`
        );
        if (res && Array.isArray(res.data)) {
          setLiveStudents(res.data);
        }
      } catch {
        // Fallback to local cache filtering silently
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, [query, isSearchOpen]);

  // Combine and deduplicate student suggestions
  const suggestedStudents = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    // Local cached matches
    const localMatches = cachedStudents.filter((s) => {
      const name = (s.name || `${s.firstName || ''} ${s.lastName || ''}`).toLowerCase();
      const roll = (s.rollNo || '').toLowerCase();
      const cls = (s.className || '').toLowerCase();
      const sec = (s.sectionName || '').toLowerCase();
      return (
        name.includes(q) ||
        roll.includes(q) ||
        `${cls} ${sec}`.includes(q) ||
        `${cls}-${sec}`.includes(q)
      );
    });

    // Merge with live students from API
    const seenIds = new Set<string>();
    const merged: StudentSuggestionItem[] = [];

    for (const item of [...localMatches, ...liveStudents]) {
      if (item?.id && !seenIds.has(item.id)) {
        seenIds.add(item.id);
        merged.push(item);
      }
    }

    return merged.slice(0, 50);
  }, [query, cachedStudents, liveStudents]);

  const getInitials = (name?: string) => {
    if (!name) return 'ST';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  useEffect(() => {
    if (!isSearchOpen) return;
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleCloseSearch();
      return true;
    });
    return () => backHandler.remove();
  }, [isSearchOpen]);

  const handleOpenSearch = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setIsSearchOpen(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 40);
  };

  const handleCloseSearch = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    Keyboard.dismiss();
    setIsSearchOpen(false);
    setLiveStudents([]);
    if (searchValue === undefined) {
      setInternalQuery('');
    }
    onSearch?.('');
  };

  const handleSearchChange = (text: string) => {
    if (searchValue === undefined) {
      setInternalQuery(text);
    }
    onSearch?.(text);
  };

  const handleClearSearch = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    if (searchValue === undefined) {
      setInternalQuery('');
    }
    setLiveStudents([]);
    onSearch?.('');
  };

  const handleSearchSubmit = () => {
    if (query.trim().length > 0) {
      if (suggestedStudents.length > 0) {
        handleSelectStudent(suggestedStudents[0]);
      } else if (!onSearch) {
        handleCloseSearch();
        router.push(`/(tabs)/students` as any);
      }
    }
  };

  const handleSelectStudent = async (student: StudentSuggestionItem) => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    Keyboard.dismiss();
    handleCloseSearch();
    router.push(`/student/${student.id}` as any);
  };

  const handleOpenDropdown = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setIsDropdownOpen(true);
  };

  const handleNavigateProfile = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setIsDropdownOpen(false);
    router.push('/(tabs)/profile');
  };

  const handleLogout = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    setIsDropdownOpen(false);
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <>
      {/* Layout spacer keeping underlying scroll view at exact position when search opens */}
      {isSearchOpen && <View style={styles.headerSpacer} />}

      <View
        style={[
          styles.fixedHeaderWrapper,
          isSearchOpen && styles.fixedHeaderWrapperActive,
        ]}
      >
        {isSearchOpen ? (
          <View style={styles.searchActiveContainer}>
            {/* Search Input Bar Row */}
            <View style={styles.searchBarRow}>
              <View style={styles.searchInputWrapper}>
                <Search size={17} color="#6559FC" style={styles.searchIcon} />
                <TextInput
                  ref={searchInputRef}
                  style={styles.searchInput}
                  placeholder={searchPlaceholder}
                  placeholderTextColor="#94A3B8"
                  value={query}
                  onChangeText={handleSearchChange}
                  onSubmitEditing={handleSearchSubmit}
                  returnKeyType="search"
                  autoFocus={true}
                  showSoftInputOnFocus={true}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {query.length > 0 && (
                  <TouchableOpacity
                    onPress={handleClearSearch}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    style={styles.clearBtn}
                  >
                    <X size={15} color="#94A3B8" />
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity
                style={styles.cancelSearchBtn}
                onPress={handleCloseSearch}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.cancelSearchText}>Cancel</Text>
              </TouchableOpacity>
            </View>

            {/* Suggestions Container & Vertical Scroll Area */}
            {query.trim().length > 0 ? (
              <View style={styles.suggestionsCard}>
                {/* Header Strip with Result Count */}
                <View style={styles.dropdownHeaderRow}>
                  <View style={styles.dropdownHeaderTitleGroup}>
                    <Users size={14} color="#6559FC" />
                    <Text style={styles.dropdownHeaderTitle}>SUGGESTED STUDENTS</Text>
                  </View>
                  {isSearching ? (
                    <ActivityIndicator size="small" color="#6559FC" />
                  ) : (
                    <Text style={styles.dropdownHeaderCount}>
                      {suggestedStudents.length} found
                    </Text>
                  )}
                </View>

                {/* Vertically Scrollable Students List */}
                <ScrollView
                  style={styles.suggestionsScrollView}
                  contentContainerStyle={styles.suggestionsScrollContent}
                  keyboardShouldPersistTaps="handled"
                  keyboardDismissMode="on-drag"
                  showsVerticalScrollIndicator={true}
                  nestedScrollEnabled={true}
                  bounces={true}
                >
                  {suggestedStudents.length > 0 ? (
                    suggestedStudents.map((student) => {
                      const displayName =
                        student.name ||
                        `${student.firstName || ''} ${student.lastName || ''}`.trim() ||
                        'Student';
                      const initials = getInitials(displayName);

                      return (
                        <TouchableOpacity
                          key={student.id}
                          style={styles.studentCard}
                          onPress={() => handleSelectStudent(student)}
                          activeOpacity={0.7}
                        >
                          {/* Student Avatar */}
                          <View style={styles.studentAvatar}>
                            {student.profileImage ? (
                              <Image
                                source={{ uri: student.profileImage }}
                                style={styles.studentAvatarImg}
                              />
                            ) : (
                              <Text style={styles.studentAvatarText}>{initials}</Text>
                            )}
                          </View>

                          {/* Student Details */}
                          <View style={styles.studentInfoCol}>
                            <Text style={styles.studentNameText} numberOfLines={1}>
                              {displayName}
                            </Text>
                            <View style={styles.studentMetaRow}>
                              <Text style={styles.studentRollText}>
                                Roll No: {student.rollNo || '--'}
                              </Text>
                              <Text style={styles.metaDot}>•</Text>
                              <Text style={styles.studentClassText} numberOfLines={1}>
                                {student.className}
                                {student.sectionName ? ` - ${student.sectionName}` : ''}
                              </Text>
                            </View>
                          </View>

                          {/* Class Pill */}
                          <View style={styles.classSectionPill}>
                            <GraduationCap size={11} color="#6559FC" />
                            <Text style={styles.classSectionPillText} numberOfLines={1}>
                              {student.className}
                              {student.sectionName ? ` - ${student.sectionName}` : ''}
                            </Text>
                          </View>

                          <ChevronRight size={15} color="#CBD5E1" />
                        </TouchableOpacity>
                      );
                    })
                  ) : isSearching ? (
                    <View style={styles.emptyState}>
                      <ActivityIndicator size="small" color="#6559FC" />
                      <Text style={styles.emptyStateText}>
                        Searching students for "{query}"...
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.emptyState}>
                      <Users size={26} color="#94A3B8" />
                      <Text style={styles.emptyStateTitle}>No Students Found</Text>
                      <Text style={styles.emptyStateText}>
                        No students matching "{query}" found in your assigned roster.
                      </Text>
                    </View>
                  )}
                </ScrollView>
              </View>
            ) : (
              /* Backdrop when search bar is open but empty */
              <Pressable
                style={styles.modalBackdropEmpty}
                onPress={handleCloseSearch}
              >
                <View style={styles.emptyHintBox}>
                  <Text style={styles.emptyHintText}>
                    Type a student name, roll number, or class to view suggestions
                  </Text>
                </View>
              </Pressable>
            )}
          </View>
        ) : (
          /* Standard Header Row: Organization Name & AY on Left, Search Icon & Profile on Right */
          <View style={styles.headerRow}>
            {/* Left: Organization Name & Academic Year */}
            <View style={styles.orgInfoCol}>
              <View style={styles.orgTitleRow}>
                <School size={16} color="#6559FC" style={styles.schoolIcon} />
                <Text style={styles.orgNameText} numberOfLines={1}>
                  {organizationName}
                </Text>
              </View>

              <View style={styles.ayBadge}>
                <Calendar size={11} color="#6559FC" />
                <Text style={styles.ayBadgeText} numberOfLines={1}>
                  AY {academicYear}
                </Text>
              </View>
            </View>

            {/* Right: Search Icon Button & Profile Avatar */}
            <View style={styles.actionsRightCol}>
              {/* Search Icon Trigger */}
              <TouchableOpacity
                style={styles.searchTriggerButton}
                onPress={handleOpenSearch}
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityLabel="Search Students"
              >
                <Search size={19} color="#334155" strokeWidth={2.2} />
              </TouchableOpacity>

              {/* Profile Avatar Button with Dropdown Trigger */}
              <TouchableOpacity
                style={styles.avatarButton}
                onPress={handleOpenDropdown}
                activeOpacity={0.8}
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{getInitials(user?.name)}</Text>
                </View>
                <View
                  style={[
                    styles.networkStatusDot,
                    { backgroundColor: isOnline ? '#10B981' : '#EF4444' },
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Profile Dropdown Menu Modal */}
      <Modal
        visible={isDropdownOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsDropdownOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsDropdownOpen(false)}
        >
          <View style={styles.dropdownCard}>
            {/* User Quick Info */}
            <View style={styles.userInfoRow}>
              <View style={styles.userDropdownAvatar}>
                <Text style={styles.userDropdownAvatarText}>
                  {getInitials(user?.name)}
                </Text>
              </View>
              <View style={styles.userDropdownDetails}>
                <Text style={styles.userDropdownName} numberOfLines={1}>
                  {user?.name || 'Staff Member'}
                </Text>
                <Text style={styles.userDropdownRole} numberOfLines={1}>
                  {user?.email || user?.role || 'Staff Member'}
                </Text>
              </View>
            </View>

            {/* Institution Details Row */}
            <View style={styles.dropdownOrgInfo}>
              <View style={styles.dropdownOrgRow}>
                <School size={12} color="#6559FC" />
                <Text style={styles.dropdownOrgName} numberOfLines={1}>
                  {organizationName}
                </Text>
              </View>
              <View style={styles.dropdownAyRow}>
                <Calendar size={11} color="#64748B" />
                <Text style={styles.dropdownAyText}>
                  Academic Year: {academicYear}
                </Text>
              </View>
              <View style={styles.dropdownOnlineRow}>
                {isOnline ? (
                  <Wifi size={11} color="#059669" />
                ) : (
                  <WifiOff size={11} color="#DC2626" />
                )}
                <Text
                  style={[
                    styles.dropdownOnlineText,
                    { color: isOnline ? '#059669' : '#DC2626' },
                  ]}
                >
                  {isOnline ? 'System Online' : 'Offline Mode (Local Sync)'}
                </Text>
              </View>
            </View>

            <View style={styles.dropdownDivider} />

            {/* Profile Navigation Action */}
            <TouchableOpacity
              style={styles.dropdownMenuItem}
              onPress={handleNavigateProfile}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconCircle, { backgroundColor: '#EEF2FF' }]}>
                <User size={16} color="#6559FC" />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={styles.menuItemTitle}>Account Profile</Text>
                <Text style={styles.menuItemSubtitle}>Sync & preferences</Text>
              </View>
              <ChevronRight size={15} color="#CBD5E1" />
            </TouchableOpacity>

            <View style={styles.dropdownDivider} />

            {/* Logout Action */}
            <TouchableOpacity
              style={styles.dropdownMenuItem}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconCircle, { backgroundColor: '#FEF2F2' }]}>
                <LogOut size={16} color="#EF4444" />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={[styles.menuItemTitle, { color: '#EF4444' }]}>
                  Log Out
                </Text>
                <Text style={styles.menuItemSubtitle}>Sign out from this device</Text>
              </View>
              <ChevronRight size={15} color="#CBD5E1" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fixedHeaderWrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    zIndex: 50,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  orgInfoCol: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 12,
  },
  orgTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  schoolIcon: {
    marginTop: 1,
  },
  orgNameText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
    flexShrink: 1,
  },
  ayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 3,
  },
  ayBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6559FC',
    letterSpacing: 0.2,
  },
  actionsRightCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchTriggerButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarButton: {
    position: 'relative',
    padding: 1,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#6559FC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#EEF2FF',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  networkStatusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  headerSpacer: {
    height: 64,
  },
  fixedHeaderWrapperActive: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT,
    zIndex: 99999,
    elevation: 99999,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
    borderBottomWidth: 0,
    shadowOpacity: 0,
  },
  searchActiveContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  searchBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 6,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 4,
  },
  cancelSearchBtn: {
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  cancelSearchText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6559FC',
  },

  // Suggestions Card inside Search View
  suggestionsCard: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    maxHeight: SCREEN_HEIGHT * 0.55,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 12,
    overflow: 'hidden',
  },
  dropdownHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FAF5FF',
  },
  dropdownHeaderTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dropdownHeaderTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6559FC',
    letterSpacing: 0.5,
  },
  dropdownHeaderCount: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  suggestionsScrollView: {
    flexGrow: 0,
  },
  suggestionsScrollContent: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    paddingBottom: 24,
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    gap: 10,
    marginVertical: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  studentAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  studentAvatarImg: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  studentAvatarText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6559FC',
  },
  studentInfoCol: {
    flex: 1,
    justifyContent: 'center',
  },
  studentNameText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  studentMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 4,
  },
  studentRollText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6559FC',
  },
  metaDot: {
    fontSize: 10,
    color: '#CBD5E1',
  },
  studentClassText: {
    fontSize: 11,
    color: '#64748B',
    flexShrink: 1,
  },
  classSectionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3.5,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    maxWidth: 90,
  },
  classSectionPillText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#6559FC',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    gap: 6,
  },
  emptyStateTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 4,
  },
  emptyStateText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 16,
  },
  modalBackdropEmpty: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 24,
  },
  emptyHintBox: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyHintText: {
    fontSize: 12.5,
    color: '#64748B',
    fontWeight: '500',
  },

  // Profile Modal Overlay Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 68,
    paddingRight: 16,
  },
  dropdownCard: {
    width: 260,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    gap: 10,
  },
  userDropdownAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6559FC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDropdownAvatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  userDropdownDetails: {
    flex: 1,
  },
  userDropdownName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  userDropdownRole: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  dropdownOrgInfo: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 8,
    marginTop: 4,
    marginBottom: 4,
    gap: 4,
  },
  dropdownOrgRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dropdownOrgName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
  },
  dropdownAyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dropdownAyText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  dropdownOnlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  dropdownOnlineText: {
    fontSize: 10.5,
    fontWeight: '600',
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
  },
  dropdownMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    gap: 10,
  },
  menuIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTextCol: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
  menuItemSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
});
