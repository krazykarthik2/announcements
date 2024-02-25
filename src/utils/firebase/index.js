import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage, ref as refStorage } from "firebase/storage";
import React from "react";
const firebaseConfig = {
  apiKey: "AIzaSyC_bknTyB5bXN00MwYzZvl1D3I0ON1XiJ4",
  authDomain: "announcements-simple.firebaseapp.com",
  projectId: "announcements-simple",
  storageBucket: "announcements-simple.appspot.com",
  messagingSenderId: "164010498087",
  appId: "1:164010498087:web:3beb461e3af70e9eabd602",
  measurementId: "G-J8JCFY4Y5X",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);
const auth = getAuth(app);
window.fb={auth,refStorage,storage,analytics};
const UserContext = React.createContext();

export { analytics, auth, refStorage, storage ,UserContext };

