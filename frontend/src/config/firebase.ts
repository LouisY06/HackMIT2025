import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDaL5XruDZWhm4oha9xOjMzvhnsqGConec",
  authDomain: "mithacks-f2339.firebaseapp.com",
  projectId: "mithacks-f2339",
  storageBucket: "mithacks-f2339.firebasestorage.app",
  messagingSenderId: "135438775577",
  appId: "1:135438775577:web:76229c88e2e1845652c188",
  measurementId: "G-X0SNLJBMM4"
};

console.log('Initializing Firebase with config:', firebaseConfig);
console.log('User Agent:', navigator.userAgent);
console.log('Is Mobile:', /iPhone|iPad|iPod|Android/i.test(navigator.userAgent));

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

console.log('Firebase auth initialized:', !!auth);
console.log('Current URL:', window.location.href);
console.log('Environment:', process.env.NODE_ENV);

export default app;
