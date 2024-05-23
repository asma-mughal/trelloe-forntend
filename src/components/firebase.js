
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCK6HDu0BBGB3mFrdbRLf7zshuXzMQaa7Y",
  authDomain: "uploadingproject-72f99.firebaseapp.com",
  projectId: "uploadingproject-72f99",
  storageBucket: "uploadingproject-72f99.appspot.com",
  messagingSenderId: "563922223288",
  appId: "1:563922223288:web:201cd50c4bf9347f58344d",
  measurementId: "G-67D68JMFVX"
};

const app = initializeApp(firebaseConfig);
export const auth=getAuth();
export const db=getFirestore(app);
export default app;