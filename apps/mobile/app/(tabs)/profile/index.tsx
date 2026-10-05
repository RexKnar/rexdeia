import * as Haptics from 'expo-haptics';
import {
  Cloud,
  CloudOff,
  LogOut,
  RefreshCw,
  Server,
  Sparkles,
  Trash2,
  UserCheck,
  Wifi,
  WifiOff,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../../src/components/Button';
import { Header } from '../../../src/components/Header';
import { useAuth } from '../../../src/context/auth';
import { useNetworkSync } from '../../../src/context/network-sync';
import { OTAUpdates } from '../../../src/lib/updates';
import { COLORS } from '../../../src/theme/colors';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { isOnline, pendingCount, isSyncing, syncNow, clearQueue } =
    useNetworkSync();
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);

  const handleSyncNow = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    const res = await syncNow();
    Alert.alert(
      'Sync Complete',
      `Successfully synced ${res.succeeded} actions. (${res.failed} failed)`
    );
  };

  const handleClearQueue = () => {
    Alert.alert(
      'Clear Offline Queue?',
      'Any un-synced offline attendance or marks will be permanently discarded.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await clearQueue();
            try {
              await Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Warning
              );
            } catch {}
          },
        },
      ]
    );
  };

  const handleCheckUpdates = async () => {
    setCheckingUpdate(true);
    setUpdateMessage(null);
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const res = await OTAUpdates.checkForUpdate();
      setUpdateMessage(res.message);
      if (res.isAvailable) {
        Alert.alert(
          'Update Available',
          'A new JS patch is ready. Download and apply now?',
          [
            { text: 'Later', style: 'cancel' },
            {
              text: 'Update & Restart',
              onPress: async () => {
                await OTAUpdates.downloadAndApplyUpdate();
              },
            },
          ]
        );
      }
    } catch (e: any) {
      setUpdateMessage('Unable to check for updates: ' + e.message);
    } finally {
      setCheckingUpdate(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  const updateInfo = OTAUpdates.getInfo();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header title="Account & Sync" subtitle="Staff Profile & Settings" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        <View style={styles.card}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarBig}>
              <UserCheck size={32} color="#ffffff" />
            </View>
            <View style={styles.profileDetails}>
              <Text style={styles.userName}>{user?.name || 'Staff Member'}</Text>
              <Text style={styles.userRole}>{user?.role || 'Teaching Staff'}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
            </View>
          </View>

          <View style={styles.metaGrid}>
            <View style={styles.metaCell}>
              <Text style={styles.metaCellLabel}>Staff ID</Text>
              <Text style={styles.metaCellValue}>
                {user?.staffId ? user.staffId.slice(0, 8) : 'N/A'}
              </Text>
            </View>
            <View style={styles.metaCell}>
              <Text style={styles.metaCellLabel}>Branch</Text>
              <Text style={styles.metaCellValue}>
                {user?.branchId ? user.branchId.slice(0, 8) : 'Primary'}
              </Text>
            </View>
          </View>
        </View>

        {/* Offline Sync Manager */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Offline Sync Status</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.syncRow}>
            <View style={styles.syncStatusLeft}>
              {isOnline ? (
                <Wifi size={20} color={COLORS.success} />
              ) : (
                <WifiOff size={20} color={COLORS.danger} />
              )}
              <View>
                <Text style={styles.syncStateText}>
                  {isOnline ? 'Online (Connected)' : 'Offline (No Connection)'}
                </Text>
                <Text style={styles.syncSubText}>
                  {pendingCount === 0
                    ? 'All changes are synced with the server.'
                    : `${pendingCount} mutation(s) stored locally in queue.`}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <Button
              title={isSyncing ? 'Syncing...' : 'Force Sync Now'}
              onPress={handleSyncNow}
              isLoading={isSyncing}
              disabled={!isOnline || pendingCount === 0}
              icon={<RefreshCw size={16} color="#ffffff" />}
              style={styles.flexOne}
            />

            {pendingCount > 0 && (
              <TouchableOpacity
                style={styles.clearBtn}
                onPress={handleClearQueue}
              >
                <Trash2 size={18} color={COLORS.danger} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Over-The-Air (OTA) Updates Card */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Over-The-Air (OTA) Updates</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.otaHeader}>
            <Sparkles size={20} color={COLORS.primary} />
            <Text style={styles.otaTitle}>EAS Updates Engine</Text>
          </View>

          <View style={styles.otaDetails}>
            <View style={styles.otaRow}>
              <Text style={styles.otaLabel}>Channel:</Text>
              <Text style={styles.otaValue}>{updateInfo.channel}</Text>
            </View>
            <View style={styles.otaRow}>
              <Text style={styles.otaLabel}>Runtime Policy:</Text>
              <Text style={styles.otaValue}>{updateInfo.runtimeVersion}</Text>
            </View>
            <View style={styles.otaRow}>
              <Text style={styles.otaLabel}>Update ID:</Text>
              <Text style={styles.otaValue}>
                {updateInfo.updateId?.slice(0, 12)}...
              </Text>
            </View>
          </View>

          {updateMessage ? (
            <View style={styles.updateMsgBox}>
              <Text style={styles.updateMsgText}>{updateMessage}</Text>
            </View>
          ) : null}

          <Button
            title="Check for OTA Updates"
            variant="outline"
            onPress={handleCheckUpdates}
            isLoading={checkingUpdate}
            style={styles.otaBtn}
          />
        </View>

        {/* Logout Button */}
        <Button
          title="Sign Out"
          variant="danger"
          onPress={handleLogout}
          icon={<LogOut size={18} color="#ffffff" />}
          style={styles.logoutBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 36,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  avatarBig: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileDetails: {
    flex: 1,
  },
  userName: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  userRole: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  userEmail: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  metaGrid: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
    gap: 10,
  },
  metaCell: {
    flex: 1,
    backgroundColor: COLORS.surfaceCard,
    padding: 10,
    borderRadius: 8,
  },
  metaCellLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '500',
  },
  metaCellValue: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  sectionHeader: {
    marginBottom: 8,
    paddingLeft: 4,
  },
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  syncRow: {
    marginBottom: 14,
  },
  syncStatusLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  syncStateText: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  syncSubText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  flexOne: {
    flex: 1,
  },
  clearBtn: {
    backgroundColor: COLORS.dangerLight,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 10,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  otaTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  otaDetails: {
    backgroundColor: COLORS.surfaceCard,
    padding: 12,
    borderRadius: 8,
    gap: 6,
    marginBottom: 12,
  },
  otaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  otaLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  otaValue: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  updateMsgBox: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  updateMsgText: {
    color: COLORS.textPrimary,
    fontSize: 12,
    lineHeight: 16,
  },
  otaBtn: {
    marginTop: 4,
  },
  logoutBtn: {
    marginTop: 8,
  },
});
