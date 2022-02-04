// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app"
import { getDatabase, ref, onValue } from "firebase/database";
//import firebase from '@firebase'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXbc2QNEN1crSy9OWrL0D2oiVGhLsQ99g",
  authDomain: "caminhao-iot.firebaseapp.com",
  databaseURL: "https://caminhao-iot-default-rtdb.firebaseio.com",
  projectId: "caminhao-iot",
  storageBucket: "caminhao-iot.appspot.com",
  messagingSenderId: "842794882979",
  appId: "1:842794882979:web:5b601c001f2f8af29aec16"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
