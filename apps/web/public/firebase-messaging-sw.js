// Firebase Messaging Service Worker for background push notifications
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// Config will be initialized if self.firebaseConfig is injected, or falls back to standard background handling
const firebaseConfig = {
  apiKey: new URL(location).searchParams.get('apiKey') || '',
  authDomain: new URL(location).searchParams.get('authDomain') || '',
  projectId: new URL(location).searchParams.get('projectId') || '',
  storageBucket: new URL(location).searchParams.get('storageBucket') || '',
  messagingSenderId: new URL(location).searchParams.get('messagingSenderId') || '',
  appId: new URL(location).searchParams.get('appId') || '',
};

if (firebaseConfig.projectId) {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification?.title || payload.data?.title || 'New Notification';
    const notificationOptions = {
      body: payload.notification?.body || payload.data?.body || '',
      icon: payload.notification?.icon || '/assets/images/logo.png',
      badge: '/assets/images/logo.png',
      data: payload.data || {},
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const clickActionUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(clickActionUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(clickActionUrl);
      }
    })
  );
});
