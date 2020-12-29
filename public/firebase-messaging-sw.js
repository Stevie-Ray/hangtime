importScripts('https://www.gstatic.com/firebasejs/8.2.1/firebase-app.js')
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.2.1/firebase-messaging.js')

const config = {
  apiKey: 'AIzaSyDkE4T_MphbbPVq8gdnZjyRcLCDcqrheW8',
  authDomain: 'auth.hangtime.stevie-ray.nl',
  databaseURL: 'https://hangtime-app.firebaseio.com',
  projectId: 'hangtime-app',
  storageBucket: 'hangtime-app.appspot.com',
  messagingSenderId: '292866814265',
  appId: '1:292866814265:web:0a256263a11f5eed'
}

// eslint-disable-next-line no-undef
firebase.initializeApp(config)

// eslint-disable-next-line no-undef
const messaging = firebase.messaging()

// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// [START on_background_message]
messaging.onBackgroundMessage(function(payload) {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  )
  // Customize notification here
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'img/icons/android-chrome-512x512.png'
  }

  // eslint-disable-next-line no-restricted-globals
  self.registration.showNotification(notificationTitle, notificationOptions)
})
// [END on_background_message]
