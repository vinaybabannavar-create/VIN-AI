import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDoWMO3rH2otgydHOKqF5uld1SChUCnCHM",
  authDomain: "mini-project-828f6.firebaseapp.com",
  projectId: "mini-project-828f6",
  storageBucket: "mini-project-828f6.firebasestorage.app",
  messagingSenderId: "310760350116",
  appId: "1:310760350116:web:ec4f8a86a4fe4fd10c6131",
  measurementId: "G-DHTPS5X48D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
const analytics = getAnalytics(app);

