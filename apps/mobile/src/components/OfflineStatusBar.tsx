import * as Haptics from 'expo-haptics';
import { Cloud, CloudOff, RefreshCw } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNetworkSync } from '../context/network-sync';
import { COLORS } from '../theme/colors';

export function OfflineStatusBar() {
  const { isOnline, pendingCount, isSyncing, syncNow } = useNetworkSync();

  if (isOnline && pendingCount === 0) {
    return null;
  }

  const handleSync = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    await syncNow();
  };

  return (
    <View
      style={[
        styles.container,
        !isOnline ? styles.offlineBg : styles.pendingBg,
      ]}
    >
      <View style={styles.leftRow}>
        {!isOnline ? (
          <CloudOff size={16} color={COLORS.offlineText} />
        ) : (
          <Cloud size={16} color={COLORS.onlineText} />
        )}
        <Text
          style={[
            styles.text,
            !isOnline ? styles.offlineText : styles.pendingText,
          ]}
        >
          {!isOnline
            ? `Offline - ${pendingCount} pending action${pendingCount === 1 ? '' : 's'}`
            : `${pendingCount} action${pendingCount === 1 ? '' : 's'} queued to sync`}
        </Text>
      </View>

      {isOnline && (
        <TouchableOpacity
          style={styles.syncBtn}
          onPress={handleSync}
          disabled={isSyncing}
        >
          {isSyncing ? (
            <ActivityIndicator size="small" color={COLORS.textPrimary} />
          ) : (
            <View style={styles.btnRow}>
              <RefreshCw size={13} color={COLORS.textPrimary} />
              <Text style={styles.btnText}>Sync</Text>
            </View>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  offlineBg: {
    backgroundColor: COLORS.offlineBg,
    borderColor: '#78350f',
    borderWidth: 1,
  },
  pendingBg: {
    backgroundColor: '#1e1b4b',
    borderColor: '#3730a3',
    borderWidth: 1,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  text: {
    fontSize: 13,
    fontWeight: '500',
  },
  offlineText: {
    color: COLORS.offlineText,
  },
  pendingText: {
    color: '#a5b4fc',
  },
  syncBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  btnText: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
});
