import firebase from 'firebase/app';
import 'firebase/storage';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBuqQLZy4AkWpHzv0p3lUp0hW2kecrult0',
  authDomain: 'comp3900-chicken-images.firebaseapp.com',
  databaseURL: 'gs://comp3900-chicken-images.appspot.com/',
  projectId: 'comp3900-chicken-images',
  storageBucket: 'comp3900-chicken-images.appspot.com',
  messagingSenderId: '36667604180',
  appId: '1:36667604180:web:174656c4d1cbc1671d0f41',
  measurementId: 'G-CJ3HC6EY2K',
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export { storage, firebase as default };
