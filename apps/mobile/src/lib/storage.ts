import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const SECURE_KEYS = {
  ACCESS_TOKEN: 'rexdeia_access_token',
  REFRESH_TOKEN: 'rexdeia_refresh_token',
  USER_DATA: 'rexdeia_user_data',
};

async function setItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    await AsyncStorage.setItem(key, value);
    return;
  }
  try {
    await SecureStore.setItemAsync(key, value);
  } catch {
    await AsyncStorage.setItem(key, value);
  }
}

async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return AsyncStorage.getItem(key);
  }
  try {
    const val = await SecureStore.getItemAsync(key);
    if (val) return val;
    return AsyncStorage.getItem(key);
  } catch {
    return AsyncStorage.getItem(key);
  }
}

async function removeItem(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    await AsyncStorage.removeItem(key);
    return;
  }
  try {
    await SecureStore.deleteItemAsync(key);
  } catch {
    // Ignore error
  }
  await AsyncStorage.removeItem(key);
}

export const AuthStorage = {
  async saveTokens(tokens: { accessToken: string; refreshToken: string }) {
    await setItem(SECURE_KEYS.ACCESS_TOKEN, tokens.accessToken);
    await setItem(SECURE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
  },

  async getAccessToken(): Promise<string | null> {
    return getItem(SECURE_KEYS.ACCESS_TOKEN);
  },

  async getRefreshToken(): Promise<string | null> {
    return getItem(SECURE_KEYS.REFRESH_TOKEN);
  },

  async saveUser(user: any) {
    await setItem(SECURE_KEYS.USER_DATA, JSON.stringify(user));
  },

  async getUser(): Promise<any | null> {
    const data = await getItem(SECURE_KEYS.USER_DATA);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  async clearAll() {
    await removeItem(SECURE_KEYS.ACCESS_TOKEN);
    await removeItem(SECURE_KEYS.REFRESH_TOKEN);
    await removeItem(SECURE_KEYS.USER_DATA);
  },
};
