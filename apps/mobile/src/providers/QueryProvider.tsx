import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import React from 'react';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 2, // 2 hours local garbage collection (prevents storage bloat)
      staleTime: 1000 * 60 * 5, // 5 minutes fresh
      retry: 1,
    },
  },
});

const PERSISTER_KEY = 'rexdeia_react_query_offline_cache';

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: PERSISTER_KEY,
});

export async function clearQueryCache() {
  try {
    queryClient.clear();
    await AsyncStorage.removeItem(PERSISTER_KEY).catch(() => {});
  } catch {}
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: asyncStoragePersister,
        maxAge: 1000 * 60 * 60 * 2,
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => query.state.status === 'success',
        },
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
