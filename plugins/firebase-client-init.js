import * as firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/functions';


export default !firebase.apps.length ? firebase.initializeApp(process.env.FIREBASE_CONFIG) : firebase.app()

// Firestore
let firestore = firebase.firestore();
export const db = firestore;
export const GeoPoint = firebase.Geopoint;
export const storage = firebase.storage();
export const FieldValue = firebase.firestore.FieldValue;
export const functions = firebase.functions();

// Auth
firebase.auth().useDeviceLanguage();
export const Auth = firebase.auth()
export const GoogleAuthProvider = new firebase.auth.GoogleAuthProvider()
