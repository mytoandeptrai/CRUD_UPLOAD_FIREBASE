import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBDCh4TH2vNaEPhImLIvWFlDIVWz3OdVb4",
  authDomain: "crud-upload-8ce4d.firebaseapp.com",
  projectId: "crud-upload-8ce4d",
  storageBucket: "crud-upload-8ce4d.appspot.com",
  messagingSenderId: "161101394110",
  appId: "1:161101394110:web:4920078305eecc1b486eef",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
