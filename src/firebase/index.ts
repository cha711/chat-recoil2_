import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

firebase.initializeApp({
  apiKey: 'AIzaSyDsR2shGawQH1RqaZX-o_skSYLp9W3YP04',
  authDomain: 'recoil-d613b.firebaseapp.com',
  databaseURL: 'https://recoil-d613b-default-rtdb.firebaseio.com',
  projectId: 'recoil-d613b',
  storageBucket: 'recoil-d613b.appspot.com',
  messagingSenderId: '760659542152',
  appId: '1:760659542152:web:4b07588a5424cd86969f3d',
  measurementId: 'G-KGLMF4XYX3',
});

export default firebase;
