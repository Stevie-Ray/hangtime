import firebase from 'firebase/app'
import 'firebase/auth'

// The configuration below is not sensitive data. You can serenely add your config here
const config = {
  apiKey: 'AIzaSyDkE4T_MphbbPVq8gdnZjyRcLCDcqrheW8',
  authDomain: 'hangtime-app.firebaseapp.com',
  databaseURL: 'https://hangtime-app.firebaseio.com',
  projectId: 'hangtime-app',
  storageBucket: 'hangtime-app.appspot.com',
  messagingSenderId: '292866814265',
  appId: '1:292866814265:web:0a256263a11f5eed'
}

firebase.initializeApp(config)
