import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './api';

const QUEUE_STORAGE_KEY = 'rexdeia_offline_mutation_queue';

export interface QueuedMutation {
  id: string;
  type: 'ATTENDANCE' | 'MARK_ENTRY' | 'GENERIC';
  endpoint: string;
  method: 'POST' | 'PUT';
  payload: any;
  createdAt: number;
  retryCount: number;
  status: 'PENDING' | 'SYNCING' | 'FAILED';
  lastError?: string;
}

type QueueListener = (queue: QueuedMutation[]) => void;
const listeners: QueueListener[] = [];

function notifyListeners(queue: QueuedMutation[]) {
  listeners.forEach((cb) => cb(queue));
}

export function subscribeToQueue(callback: QueueListener): () => void {
  listeners.push(callback);
  return () => {
    const idx = listeners.indexOf(callback);
    if (idx !== -1) listeners.splice(idx, 1);
  };
}

export const SyncQueue = {
  async getQueue(): Promise<QueuedMutation[]> {
    try {
      const raw = await AsyncStorage.getItem(QUEUE_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  async saveQueue(queue: QueuedMutation[]): Promise<void> {
    try {
      await AsyncStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
      notifyListeners(queue);
    } catch (err) {
      console.error('Failed to persist sync queue:', err);
    }
  },

  async enqueue(
    type: QueuedMutation['type'],
    endpoint: string,
    payload: any,
    method: 'POST' | 'PUT' = 'POST'
  ): Promise<QueuedMutation> {
    const queue = await this.getQueue();
    const mutation: QueuedMutation = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      endpoint,
      method,
      payload,
      createdAt: Date.now(),
      retryCount: 0,
      status: 'PENDING',
    };

    queue.push(mutation);
    await this.saveQueue(queue);
    return mutation;
  },

  async getPendingCount(): Promise<number> {
    const queue = await this.getQueue();
    return queue.filter((m) => m.status === 'PENDING' || m.status === 'FAILED').length;
  },

  async flush(): Promise<{ succeeded: number; failed: number }> {
    const queue = await this.getQueue();
    if (queue.length === 0) return { succeeded: 0, failed: 0 };

    let succeeded = 0;
    let failed = 0;
    const remaining: QueuedMutation[] = [];

    for (const item of queue) {
      try {
        item.status = 'SYNCING';
        await this.saveQueue([...remaining, ...queue.slice(queue.indexOf(item))]);

        if (item.method === 'POST') {
          await api.post(item.endpoint, item.payload);
        } else {
          await api.put(item.endpoint, item.payload);
        }

        succeeded++;
      } catch (err: any) {
        failed++;
        item.status = 'FAILED';
        item.retryCount = (item.retryCount || 0) + 1;
        item.lastError = err?.message || 'Sync failed';
        remaining.push(item);
      }
    }

    await this.saveQueue(remaining);
    return { succeeded, failed };
  },

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(QUEUE_STORAGE_KEY);
    notifyListeners([]);
  },
};
