// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "monlithestate.firebaseapp.com",
  projectId: "monlithestate",
  storageBucket: "monlithestate.appspot.com",
  messagingSenderId: "504459743500",
  appId: "1:504459743500:web:d4b272a290900b9e343929"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);