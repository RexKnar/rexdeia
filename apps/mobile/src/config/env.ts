import Constants from 'expo-constants';
import { Platform } from 'react-native';

declare const process: any;

const envApiUrl = process.env.EXPO_PUBLIC_API_URL;
const envHostIp = process.env.EXPO_PUBLIC_HOST_IP;

const getDevHost = () => {
  // 1. Direct API URL specified in .env
  if (envApiUrl) {
    return envApiUrl;
  }

  // 2. Specific IP address specified in .env
  if (envHostIp) {
    return `http://${envHostIp}:3000`;
  }

  // 3. Auto-detected host IP from Expo Metro connection
  const hostUri =
    Constants.expoConfig?.hostUri ||
    (Constants as any).manifest2?.extra?.expoClient?.hostUri ||
    (Constants as any).manifest?.debuggerHost;

  if (hostUri) {
    const ip = hostUri.split(':')[0];
    return `http://${ip}:3000`;
  }

  // 4. Android Emulator loopback fallback
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  }

  return 'https://rexdeia.vercel.app';
};

export const ENV = {
  API_BASE_URL:
    envApiUrl ||
    Constants.expoConfig?.extra?.apiUrl ||
    (__DEV__ ? getDevHost() : 'https://rexdeia.vercel.app'),
};
