// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.

importScripts('https://www.gstatic.com/firebasejs/12.2.1/firebase-app-compat.js')

importScripts('https://www.gstatic.com/firebasejs/12.2.1/firebase-messaging-compat.js')

const config = {
  apiKey: 'AIzaSyDkE4T_MphbbPVq8gdnZjyRcLCDcqrheW8',
  authDomain: 'hangtime.stevie-ray.nl',
  databaseURL: 'https://hangtime-app.firebaseio.com',
  projectId: 'hangtime-app',
  storageBucket: 'hangtime-app.appspot.com',
  messagingSenderId: '292866814265',
  appId: '1:292866814265:web:0a256263a11f5eed'
}

firebase.initializeApp(config)

// Check if messaging is supported
if (firebase.messaging.isSupported()) {
  // Retrieve an instance of Firebase Messaging so that it can handle background
  // messages.
  const messaging = firebase.messaging()

  // If you would like to customize notifications that are received in the
  // background (Web app is closed or not in browser focus) then you should
  // implement this optional method.
  // [START on_background_message]
  messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload)
    // Customize notification here
    const notificationTitle = payload.notification.title
    const notificationOptions = {
      body: payload.notification.body,
      icon: 'img/icons/android-chrome-512x512.png'
    }

    self.registration.showNotification(notificationTitle, notificationOptions)
  })
  // [END on_background_message]
}
