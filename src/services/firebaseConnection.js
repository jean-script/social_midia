import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyDKU-8ZzpfYrRu_0WRJEwU9esO4APCVv8E",
  authDomain: "socialmidia-15424.firebaseapp.com",
  projectId: "socialmidia-15424",
  storageBucket: "socialmidia-15424.appspot.com",
  messagingSenderId: "652688149481",
  appId: "1:652688149481:web:5ad492eb0644e95c03d978"
};


const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const storge = getStorage(firebaseApp);

export { db, auth, storge };