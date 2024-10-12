// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB0d5daZLYwm7qDV4WR1v5FdxLl_fo2d5w",
  authDomain: "thrive-59210.firebaseapp.com",
  projectId: "thrive-59210",
  storageBucket: "thrive-59210.appspot.com",
  messagingSenderId: "54459795320",
  appId: "1:54459795320:web:5663b9ee19313b9baaea8d",
  measurementId: "G-GL8P0FSBDB"
};

// Initialize Firebase

const FIREBASE_APP = initializeApp(firebaseConfig);

export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
    persistence: getReactNativePersistence(AsyncStorage)
});

export const FIRESTORE = getFirestore(FIREBASE_APP);