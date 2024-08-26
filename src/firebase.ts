import { initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  confirmPasswordReset as firebaseConfirmPasswordReset,
  createUserWithEmailAndPassword as firebaseCreateUserWithEmailAndPassword,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  updatePassword as firebaseUpdatePassword,
  EmailAuthProvider,
  getAuth
} from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: 'AIzaSyAMifcZweS5BG3BfMQpjbbDP-pkF9cow2s',
  authDomain: 'shepherd-app-382114.firebaseapp.com',
  projectId: 'shepherd-app-382114',
  storageBucket: 'shepherd-app-382114.appspot.com',
  messagingSenderId: '675537393578',
  databaseUrl: 'https://shepherd-app-382114-default-rtdb.firebaseio.com',
  appId: '1:675537393578:web:9a57af7df8fec9f8293dd3'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const database = getDatabase(app);
export const firebaseAuth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const sendPasswordResetEmail = firebaseSendPasswordResetEmail;
export const confirmPasswordReset = firebaseConfirmPasswordReset;
export const createUserWithEmailAndPassword =
  firebaseCreateUserWithEmailAndPassword;
export const signInWithEmailAndPassword = firebaseSignInWithEmailAndPassword;
export const updatePassword = firebaseUpdatePassword;
