// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBGwf9d2pTLM_9JNnuj84jxIwlRvekxOpc",
  authDomain: "foodfinder-3e7fc.firebaseapp.com",
  projectId: "foodfinder-3e7fc",
  storageBucket: "foodfinder-3e7fc.appspot.com",
  messagingSenderId: "114534292917",
  appId: "1:114534292917:web:7705d146df35389d030dfc",
  measurementId: "G-Q1JZLKWT2E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
