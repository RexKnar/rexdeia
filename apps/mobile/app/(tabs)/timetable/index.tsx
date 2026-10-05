import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  RefreshCw,
  School,
} from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../../src/components/Header';
import { OfflineStatusBar } from '../../../src/components/OfflineStatusBar';
import { useAuth } from '../../../src/context/auth';
import { api } from '../../../src/lib/api';
import { COLORS } from '../../../src/theme/colors';

interface SubstitutionItem {
  id: string;
  periodLabel: string;
  className: string;
  subjectName: string;
  room: string;
  reason: string;
}

export default function TimetableScreen() {
  const { user } = useAuth();
  const [substitutions, setSubstitutions] = useState<SubstitutionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // User-scoped cache key
  const storageKey = user?.id ? `@rexdeia_timetable_${user.id}` : null;

  useEffect(() => {
    // Reset state on user switch
    setSubstitutions([]);
    setErrorMessage(null);
    if (!user?.id) {
      setIsLoading(false);
      return;
    }
    loadCachedTimetable();
    fetchTimetable();
  }, [user?.id]);

  const loadCachedTimetable = async () => {
    if (!storageKey) return;
    try {
      const cached = await AsyncStorage.getItem(storageKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          setSubstitutions(parsed);
          setIsLoading(false);
        }
      }
    } catch {}
  };

  const fetchTimetable = useCallback(
    async (isPull = false) => {
      if (!user?.id) {
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }
      if (isPull) setIsRefreshing(true);
      else setIsLoading(true);
      setErrorMessage(null);

      try {
        const res = await api.get<{ substitutions: SubstitutionItem[] }>(
          '/api/mobile/v1/timetable'
        );
        if (res && Array.isArray(res.substitutions)) {
          setSubstitutions(res.substitutions);
          if (storageKey) {
            await AsyncStorage.setItem(storageKey, JSON.stringify(res.substitutions));
          }
        }
      } catch (err: any) {
        if (err?.message !== 'SESSION_EXPIRED') {
          setErrorMessage(err?.message || 'Unable to load today\'s timetable.');
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [user?.id, storageKey]
  );

  const handleRefresh = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    fetchTimetable(true);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header
        title="My Timetable"
        subtitle="Today's Schedule & Substitutions"
      />

      <OfflineStatusBar />

      {isLoading && substitutions.length === 0 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading schedule...</Text>
        </View>
      ) : errorMessage && substitutions.length === 0 ? (
        <View style={styles.centerContainer}>
          <AlertTriangle size={36} color={COLORS.danger} />
          <Text style={styles.emptyTitle}>Could Not Load Schedule</Text>
          <Text style={styles.emptySubtitle}>{errorMessage}</Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => fetchTimetable()}
            activeOpacity={0.8}
          >
            <RefreshCw size={15} color="#FFFFFF" />
            <Text style={styles.retryBtnText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={substitutions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
            />
          }
          ListHeaderComponent={
            substitutions.length > 0 ? (
              <View style={styles.alertBanner}>
                <AlertTriangle size={18} color={COLORS.warning} />
                <View style={styles.alertContent}>
                  <Text style={styles.alertTitle}>Substitutions Assigned</Text>
                  <Text style={styles.alertText}>
                    You have {substitutions.length} active substitution period
                    {substitutions.length > 1 ? 's' : ''} assigned for today.
                  </Text>
                </View>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <CheckCircle2 size={40} color={COLORS.success} />
              <Text style={styles.emptyTitle}>No Scheduled Classes</Text>
              <Text style={styles.emptySubtitle}>
                No timetable entries or substitutions found for today.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={[styles.card, styles.cardSubstitution]}>
              <View style={styles.periodCol}>
                <Text style={styles.periodNum}>{item.periodLabel}</Text>
                <View style={styles.timeRow}>
                  <Clock size={11} color={COLORS.textMuted} />
                  <Text style={styles.timeText}>Active</Text>
                </View>
              </View>

              <View style={styles.detailsCol}>
                <View style={styles.badgeRow}>
                  <View style={styles.subBadge}>
                    <Text style={styles.subBadgeText}>SUBSTITUTION</Text>
                  </View>
                </View>

                <Text style={styles.subjectText}>{item.subjectName}</Text>
                {item.className ? (
                  <Text style={styles.classText}>{item.className}</Text>
                ) : null}

                <View style={styles.roomRow}>
                  <MapPin size={12} color={COLORS.textMuted} />
                  <Text style={styles.roomText}>{item.room || 'Classroom'}</Text>
                </View>

                {item.reason ? (
                  <Text style={styles.reasonText}>Note: {item.reason}</Text>
                ) : null}
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    color: COLORS.textMuted,
    marginTop: 10,
    fontSize: 13,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.warningLight,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    gap: 10,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    color: COLORS.warning,
    fontSize: 13,
    fontWeight: '700',
  },
  alertText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 14,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  cardSubstitution: {
    borderColor: 'rgba(245, 158, 11, 0.4)',
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
  },
  periodCol: {
    width: 95,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
    paddingRight: 10,
    justifyContent: 'center',
  },
  periodNum: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '800',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  timeText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '500',
  },
  detailsCol: {
    flex: 1,
    paddingLeft: 14,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  subBadge: {
    backgroundColor: COLORS.warningLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  subBadgeText: {
    color: COLORS.warning,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subjectText: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  classText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  roomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  roomText: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  reasonText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 4,
  },
});
