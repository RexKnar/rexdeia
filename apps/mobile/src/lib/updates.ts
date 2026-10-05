import Constants, { ExecutionEnvironment } from 'expo-constants';

const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient ||
  (Constants as any).appOwnership === 'expo';

export interface UpdateInfo {
  isEnabled: boolean;
  channel: string | null;
  runtimeVersion: string | null;
  updateId: string | null;
  isEmbeddedLaunch: boolean;
}

export const OTAUpdates = {
  getInfo(): UpdateInfo {
    if (isExpoGo || __DEV__) {
      return {
        isEnabled: false,
        channel: 'development',
        runtimeVersion: '1.0.0',
        updateId: 'expo-go-client',
        isEmbeddedLaunch: true,
      };
    }

    try {
      // Conditionally require in standalone production builds
      const Updates = require('expo-updates');
      return {
        isEnabled: Updates.isEnabled ?? false,
        channel: Updates.channel ?? 'production',
        runtimeVersion: Updates.runtimeVersion ?? '1.0.0',
        updateId: Updates.updateId ?? 'embedded',
        isEmbeddedLaunch: Updates.isEmbeddedLaunch ?? true,
      };
    } catch {
      return {
        isEnabled: false,
        channel: 'development',
        runtimeVersion: '1.0.0',
        updateId: 'embedded',
        isEmbeddedLaunch: true,
      };
    }
  },

  async checkForUpdate(): Promise<{ isAvailable: boolean; message: string }> {
    if (isExpoGo || __DEV__) {
      return {
        isAvailable: false,
        message: 'OTA updates are managed by EAS in production builds. (Disabled in Expo Go).',
      };
    }

    try {
      const Updates = require('expo-updates');
      if (!Updates.isEnabled) {
        return {
          isAvailable: false,
          message: 'OTA updates are disabled in this environment.',
        };
      }
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        return {
          isAvailable: true,
          message: 'A new application update is available.',
        };
      }
      return {
        isAvailable: false,
        message: 'The application is running the latest version.',
      };
    } catch (error: any) {
      return {
        isAvailable: false,
        message: `Failed to check for updates: ${error.message}`,
      };
    }
  },

  async downloadAndApplyUpdate(): Promise<{ success: boolean; message: string }> {
    if (isExpoGo || __DEV__) {
      return {
        success: false,
        message: 'OTA updates cannot be applied inside Expo Go.',
      };
    }

    try {
      const Updates = require('expo-updates');
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
      return { success: true, message: 'Update applied successfully.' };
    } catch (error: any) {
      return {
        success: false,
        message: `Failed to download update: ${error.message}`,
      };
    }
  },
};
