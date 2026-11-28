'use client';

import { getApp, getApps, initializeApp } from 'firebase/app';
import { getMessaging, getToken, isSupported, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function getFirebaseClientApp() {
  if (!firebaseConfig.projectId) {
    return null;
  }
  return getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
}

/**
 * Request notification permission and register FCM device token with the backend
 */
export async function requestWebNotificationPermission(): Promise<string | null> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return null;
  }

  const supported = await isSupported().catch(() => false);
  if (!supported) {
    console.warn('[FirebaseClient] FCM is not supported in this browser.');
    return null;
  }

  const app = getFirebaseClientApp();
  if (!app) {
    console.warn('[FirebaseClient] NEXT_PUBLIC_FIREBASE_PROJECT_ID is not configured.');
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('[FirebaseClient] Notification permission denied by user.');
      return null;
    }

    const messaging = getMessaging(app);

    // Register service worker with config params
    let swRegistration: ServiceWorkerRegistration | undefined;
    if ('serviceWorker' in navigator) {
      const swUrl = `/firebase-messaging-sw.js?projectId=${encodeURIComponent(
        firebaseConfig.projectId || ''
      )}&messagingSenderId=${encodeURIComponent(
        firebaseConfig.messagingSenderId || ''
      )}&appId=${encodeURIComponent(firebaseConfig.appId || '')}`;

      swRegistration = await navigator.serviceWorker.register(swUrl);
    }

    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    const currentToken = await getToken(messaging, {
      vapidKey: vapidKey || undefined,
      serviceWorkerRegistration: swRegistration,
    });

    if (currentToken) {
      // Register token with backend
      await fetch('/api/notifications/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: currentToken,
          platform: 'WEB',
          deviceInfo: navigator.userAgent,
        }),
      });
      return currentToken;
    }

    return null;
  } catch (error) {
    console.error('[FirebaseClient] Error retrieving FCM token:', error);
    return null;
  }
}

/**
 * Listen for messages while the web app is in the foreground
 */
export function onForegroundMessage(callback: (payload: any) => void) {
  if (typeof window === 'undefined') return () => {};

  isSupported().then((supported) => {
    if (!supported) return;
    const app = getFirebaseClientApp();
    if (!app) return;

    try {
      const messaging = getMessaging(app);
      return onMessage(messaging, (payload) => {
        callback(payload);
      });
    } catch (e) {
      console.error('[FirebaseClient] Error subscribing to foreground messages:', e);
    }
  });

  return () => {};
}
