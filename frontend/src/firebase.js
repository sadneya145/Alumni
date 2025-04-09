// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth ,GoogleAuthProvider} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDXnIyP60kwUCdWVWn9YDEnMfuipcjyn3k",
  authDomain: "health-desk-e41e9.firebaseapp.com",
  projectId: "health-desk-e41e9",
  storageBucket: "health-desk-e41e9.firebasestorage.app",
  messagingSenderId: "787987520377",
  appId: "1:787987520377:web:c049bddb250b3b9da1eda8",
  measurementId: "G-12RF6CGP8S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Get Auth instance
const provider = new GoogleAuthProvider();
export { auth ,provider};