// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
  apiKey: 'AIzaSyBRKICAxr19oPPoMMZQXNOlFIFNLVA0Pn4',
  authDomain: 'queueoverflow-acf55.firebaseapp.com',
  projectId: 'queueoverflow-acf55',
  storageBucket: 'queueoverflow-acf55.appspot.com',
  messagingSenderId: '211966932578',
  appId: '1:211966932578:web:3175ffe1575cb9729a833b',
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
