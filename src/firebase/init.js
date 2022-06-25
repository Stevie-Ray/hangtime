import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'

// The configuration below is not sensitive data. You can serenely add your config here
const config = {
  apiKey: 'AIzaSyDkE4T_MphbbPVq8gdnZjyRcLCDcqrheW8',
  authDomain: 'auth.hangtime.stevie-ray.nl',
  databaseURL: 'https://hangtime-app.firebaseio.com',
  projectId: 'hangtime-app',
  storageBucket: 'hangtime-app.appspot.com',
  messagingSenderId: '292866814265',
  appId: '1:292866814265:web:0a256263a11f5eed'
}

firebase.initializeApp(config)
