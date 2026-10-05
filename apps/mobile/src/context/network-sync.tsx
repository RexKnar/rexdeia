import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { QueuedMutation, subscribeToQueue, SyncQueue } from '../lib/sync-queue';

interface NetworkSyncContextType {
  isOnline: boolean;
  pendingCount: number;
  isSyncing: boolean;
  queue: QueuedMutation[];
  syncNow: () => Promise<{ succeeded: number; failed: number }>;
  clearQueue: () => Promise<void>;
}

const NetworkSyncContext = createContext<NetworkSyncContextType | undefined>(undefined);

export function NetworkSyncProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [queue, setQueue] = useState<QueuedMutation[]>([]);

  // Monitor network state
  useEffect(() => {
    const unsubscribeNetInfo = NetInfo.addEventListener((state: NetInfoState) => {
      const online = Boolean(state.isConnected && state.isInternetReachable !== false);
      setIsOnline(online);
    });

    // Initial check
    NetInfo.fetch().then((state) => {
      setIsOnline(Boolean(state.isConnected && state.isInternetReachable !== false));
    });

    // Monitor queue changes
    const unsubscribeQueue = subscribeToQueue((updatedQueue) => {
      setQueue(updatedQueue);
      setPendingCount(
        updatedQueue.filter((m) => m.status === 'PENDING' || m.status === 'FAILED').length
      );
    });

    // Initial queue load
    SyncQueue.getQueue().then((q) => {
      setQueue(q);
      setPendingCount(q.filter((m) => m.status === 'PENDING' || m.status === 'FAILED').length);
    });

    return () => {
      unsubscribeNetInfo();
      unsubscribeQueue();
    };
  }, []);

  // Auto-sync when reconnecting
  useEffect(() => {
    if (isOnline && pendingCount > 0 && !isSyncing) {
      syncNow();
    }
  }, [isOnline]);

  const syncNow = async () => {
    if (isSyncing) return { succeeded: 0, failed: 0 };
    setIsSyncing(true);
    try {
      const result = await SyncQueue.flush();
      return result;
    } finally {
      setIsSyncing(false);
    }
  };

  const clearQueue = async () => {
    await SyncQueue.clear();
  };

  return (
    <NetworkSyncContext.Provider
      value={{
        isOnline,
        pendingCount,
        isSyncing,
        queue,
        syncNow,
        clearQueue,
      }}
    >
      {children}
    </NetworkSyncContext.Provider>
  );
}

export function useNetworkSync() {
  const context = useContext(NetworkSyncContext);
  if (!context) {
    throw new Error('useNetworkSync must be used within a NetworkSyncProvider');
  }
  return context;
}
