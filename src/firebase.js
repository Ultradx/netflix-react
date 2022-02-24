import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword  } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBDzZVJnyLhKKgnnHsVkh1Pf4WawiMirtI",
  authDomain: "netflix-react-3c797.firebaseapp.com",
  projectId: "netflix-react-3c797",
  storageBucket: "netflix-react-3c797.appspot.com",
  messagingSenderId: "394718230161",
  appId: "1:394718230161:web:13d5602aa7f650956bb130"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth();

export {auth, signInWithEmailAndPassword, createUserWithEmailAndPassword};
export default db;