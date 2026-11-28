import { App, cert, getApps, initializeApp } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

let firebaseAdminApp: App | null = null;

export function getFirebaseAdmin(): App | null {
  if (firebaseAdminApp) {
    return firebaseAdminApp;
  }

  const existingApps = getApps();
  if (existingApps.length > 0) {
    firebaseAdminApp = existingApps[0];
    return firebaseAdminApp;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  try {
    if (serviceAccountJson) {
      const parsed = JSON.parse(serviceAccountJson);
      firebaseAdminApp = initializeApp({
        credential: cert(parsed),
      });
      return firebaseAdminApp;
    }

    if (projectId && clientEmail && privateKey) {
      if (privateKey.includes('\\n')) {
        privateKey = privateKey.replace(/\\n/g, '\n');
      }

      firebaseAdminApp = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      return firebaseAdminApp;
    }

    console.warn(
      '[FirebaseAdmin] FCM credentials (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY) not set. Push notifications will be recorded in DB but not delivered via FCM.'
    );
    return null;
  } catch (error) {
    console.error('[FirebaseAdmin] Failed to initialize Firebase Admin SDK:', error);
    return null;
  }
}

export interface PushNotificationPayload {
  tokens: string[];
  title: string;
  body: string;
  data?: Record<string, string>;
  imageUrl?: string;
}

export interface PushNotificationResult {
  successCount: number;
  failureCount: number;
  invalidTokens: string[];
}

export async function sendMulticastPushNotification(
  payload: PushNotificationPayload
): Promise<PushNotificationResult> {
  const { tokens, title, body, data, imageUrl } = payload;

  if (!tokens || tokens.length === 0) {
    return { successCount: 0, failureCount: 0, invalidTokens: [] };
  }

  const app = getFirebaseAdmin();
  if (!app) {
    return {
      successCount: 0,
      failureCount: tokens.length,
      invalidTokens: [],
    };
  }

  const messaging = getMessaging(app);
  const invalidTokens: string[] = [];
  let successCount = 0;
  let failureCount = 0;

  // Firebase sendEachForMulticast accepts up to 500 tokens per batch
  const BATCH_SIZE = 500;
  for (let i = 0; i < tokens.length; i += BATCH_SIZE) {
    const chunk = tokens.slice(i, i + BATCH_SIZE);

    try {
      const response = await messaging.sendEachForMulticast({
        tokens: chunk,
        notification: {
          title,
          body,
          imageUrl: imageUrl || undefined,
        },
        data: data || {},
        webpush: {
          notification: {
            title,
            body,
            icon: '/assets/images/logo.png',
            badge: '/assets/images/logo.png',
          },
          fcmOptions: {
            link: data?.url || '/',
          },
        },
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            channelId: 'default_channel',
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1,
            },
          },
        },
      });

      successCount += response.successCount;
      failureCount += response.failureCount;

      response.responses.forEach((res, index) => {
        if (!res.success) {
          const errorCode = res.error?.code;
          if (
            errorCode === 'messaging/invalid-registration-token' ||
            errorCode === 'messaging/registration-token-not-registered'
          ) {
            invalidTokens.push(chunk[index]);
          }
        }
      });
    } catch (err) {
      console.error('[FirebaseAdmin] Error sending multicast batch:', err);
      failureCount += chunk.length;
    }
  }

  return { successCount, failureCount, invalidTokens };
}
