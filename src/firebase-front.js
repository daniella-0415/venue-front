import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCwi3siuIj5cce2MwZyX49uscqPQietvOM",
    authDomain: "venue-flowing-thingy.firebaseapp.com",
    projectId: "venue-flowing-thingy",
    storageBucket: "venue-flowing-thingy.appspot.com",
    messagingSenderId: "1051870911686",
    appId: "1:1051870911686:web:0f3e7c5d8b9f4e2c1a2b3c",
    measurementId: "G-XYZ1234567"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
