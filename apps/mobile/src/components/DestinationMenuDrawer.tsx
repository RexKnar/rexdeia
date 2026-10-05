import * as Haptics from 'expo-haptics';
import {
  Award,
  BarChart2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Layers,
  Maximize2,
  Minimize2,
  RefreshCw,
  Settings,
  Sparkles,
  User,
  UserCheck,
  Users,
  Wifi,
  X,
} from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface DestinationItem {
  id: string;
  title: string;
  subtitle: string;
  routeName: string;
  path?: string;
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  badge?: string;
}

const DESTINATIONS: DestinationItem[] = [
  {
    id: 'attendance',
    title: 'Attendance',
    subtitle: 'Daily Register',
    routeName: 'attendance',
    path: '/(tabs)/attendance',
    icon: UserCheck,
  },
  {
    id: 'students',
    title: 'Students',
    subtitle: 'Roster & Profile',
    routeName: 'students',
    path: '/(tabs)/students',
    icon: Users,
  },
  {
    id: 'timetable',
    title: 'Timetable',
    subtitle: 'Schedules',
    routeName: 'timetable',
    path: '/(tabs)/timetable',
    icon: Calendar,
  },
  {
    id: 'exams',
    title: 'Mark Entry',
    subtitle: 'Exams & Scores',
    routeName: 'exams',
    path: '/(tabs)/exams',
    icon: Award,
  },
  {
    id: 'analytics',
    title: 'Dashboard',
    subtitle: 'Overview & Insights',
    routeName: 'analytics',
    path: '/(tabs)/analytics',
    icon: BarChart2,
  },
  {
    id: 'staff-analysis',
    title: 'Staff Analytics',
    subtitle: 'Subject & Class Analysis',
    routeName: 'staff-analysis',
    path: '/(tabs)/staff-analysis',
    icon: Award,
  },
  {
    id: 'student-marklist',
    title: 'Student Marklist',
    subtitle: 'Marksheet, Ranks & Export',
    routeName: 'student-marklist',
    path: '/(tabs)/student-marklist',
    icon: GraduationCap,
  },
  {
    id: 'classes',
    title: 'Classes',
    subtitle: 'Class Sections',
    routeName: 'classes',
    path: '/(tabs)/classes',
    icon: GraduationCap,
  },
  {
    id: 'sync',
    title: 'Sync Hub',
    subtitle: 'Offline Queue',
    routeName: 'profile',
    path: '/(tabs)/profile',
    icon: RefreshCw,
  },
  {
    id: 'profile',
    title: 'My Profile',
    subtitle: 'Staff Account',
    routeName: 'profile',
    path: '/(tabs)/profile',
    icon: User,
  },
  {
    id: 'settings',
    title: 'Settings',
    subtitle: 'App & System',
    routeName: 'profile',
    path: '/(tabs)/profile',
    icon: Settings,
  },
];

const EXTRA_MODULES = [
  {
    id: 'announcements',
    title: 'Notices',
    subtitle: 'Campus Broadcast',
    icon: Sparkles,
  },
  {
    id: 'calendar_events',
    title: 'Events',
    subtitle: 'Academic Dates',
    icon: Calendar,
  },
  {
    id: 'support',
    title: 'Support',
    subtitle: 'Help & Docs',
    icon: CheckCircle2,
  },
];

interface DestinationMenuDrawerProps {
  visible: boolean;
  onClose: () => void;
  onSelectDestination: (dest: DestinationItem) => void;
}

export function DestinationMenuDrawer({
  visible,
  onClose,
  onSelectDestination,
}: DestinationMenuDrawerProps) {
  const insets = useSafeAreaInsets();
  const [isExpanded, setIsExpanded] = useState(false);

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleClose = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
      setIsExpanded(false);
    });
  };

  const handleSelect = async (dest: DestinationItem) => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    handleClose();
    setTimeout(() => {
      onSelectDestination(dest);
    }, 150);
  };

  const toggleExpand = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    setIsExpanded((prev) => !prev);
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={styles.modalRoot}>
        {/* Darkened Backdrop */}
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
        </Animated.View>

        {/* Slide-up Destination Card Drawer */}
        <Animated.View
          style={[
            styles.drawerSheet,
            {
              transform: [{ translateY: slideAnim }],
              paddingBottom: Math.max(insets.bottom, 16) + 12,
              maxHeight: isExpanded ? SCREEN_HEIGHT * 0.92 : SCREEN_HEIGHT * 0.78,
            },
          ]}
        >
          {/* Top Grab Handle */}
          <View style={styles.handleContainer}>
            <View style={styles.handleBar} />
          </View>

          {/* Header Row */}
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>SELECT YOUR DESTINATION</Text>
              <Text style={styles.headerSubtitle}>
                Rexdeia Unified Academic Hub
              </Text>
            </View>

            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.expandButton}
                onPress={toggleExpand}
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                {isExpanded ? (
                  <>
                    <Minimize2 size={13} color="#6559FC" strokeWidth={2.5} />
                    <Text style={styles.expandText}>Collapse</Text>
                  </>
                ) : (
                  <>
                    <Maximize2 size={13} color="#6559FC" strokeWidth={2.5} />
                    <Text style={styles.expandText}>Expand</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeCircle}
                onPress={handleClose}
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <X size={16} color="#64748B" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* 3x3 Grid of Destination Cards */}
            <View style={styles.gridContainer}>
              {DESTINATIONS.map((dest) => {
                const IconComponent = dest.icon;
                return (
                  <TouchableOpacity
                    key={dest.id}
                    style={styles.cardItem}
                    onPress={() => handleSelect(dest)}
                    activeOpacity={0.72}
                  >
                    {/* Centered Circular Icon Badge */}
                    <View style={styles.iconCircleOuter}>
                      <View style={styles.iconCircleInner}>
                        <IconComponent
                          size={22}
                          color="#6559FC"
                          strokeWidth={2.2}
                        />
                      </View>
                    </View>

                    {/* Titles */}
                    <Text style={styles.cardTitle} numberOfLines={1}>
                      {dest.title}
                    </Text>
                    <Text style={styles.cardSubtitle} numberOfLines={1}>
                      {dest.subtitle}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Extra Modules (Shown when Expanded) */}
            {isExpanded && (
              <View style={styles.expandedSection}>
                <View style={styles.expandedSectionHeader}>
                  <Text style={styles.expandedSectionTitle}>MORE SERVICES</Text>
                </View>
                <View style={styles.gridContainer}>
                  {EXTRA_MODULES.map((extra) => {
                    const IconComp = extra.icon;
                    return (
                      <TouchableOpacity
                        key={extra.id}
                        style={styles.cardItem}
                        onPress={handleClose}
                        activeOpacity={0.72}
                      >
                        <View style={[styles.iconCircleOuter, { borderColor: '#E2E8F0' }]}>
                          <View style={[styles.iconCircleInner, { backgroundColor: '#F1F5F9' }]}>
                            <IconComp size={20} color="#475569" strokeWidth={2.2} />
                          </View>
                        </View>
                        <Text style={styles.cardTitle} numberOfLines={1}>
                          {extra.title}
                        </Text>
                        <Text style={styles.cardSubtitle} numberOfLines={1}>
                          {extra.subtitle}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Bottom Brand Bar */}
            <View style={styles.bottomBrandFooter}>
              <View style={styles.brandDot} />
              <Text style={styles.brandFooterText}>
                Rexdeia Smart Campus • Always Connected
              </Text>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
  },
  drawerSheet: {
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 10,
    paddingHorizontal: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 24,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  handleBar: {
    width: 42,
    height: 4.5,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: 14,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.6,
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  expandText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6559FC',
  },
  closeCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 8,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  cardItem: {
    width: '31.5%',
    aspectRatio: 0.95,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  iconCircleOuter: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: '#E0E7FF',
    backgroundColor: '#F5F7FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  iconCircleInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 10,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
    marginTop: 2,
  },
  expandedSection: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  expandedSectionHeader: {
    marginBottom: 10,
  },
  expandedSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  bottomBrandFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 18,
    marginBottom: 6,
  },
  brandDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  brandFooterText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
});
