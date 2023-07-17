import { initializeApp } from 'firebase/app'

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDkE4T_MphbbPVq8gdnZjyRcLCDcqrheW8',
  authDomain: 'hangtime.stevie-ray.nl',
  databaseURL: 'https://hangtime-app.firebaseio.com',
  projectId: 'hangtime-app',
  storageBucket: 'hangtime-app.appspot.com',
  messagingSenderId: '292866814265',
  appId: '1:292866814265:web:0a256263a11f5eed'
}

export default initializeApp(firebaseConfig)
