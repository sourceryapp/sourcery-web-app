import * as firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth';


export default !firebase.apps.length ? firebase.initializeApp(process.env.FIREBASE_CONFIG) : firebase.app()

// Firestore
let firestore = firebase.firestore();
firestore.settings({ timestampsInSnapshots: true });
export const db = firestore;
export const GeoPoint = firebase.Geopoint;

// Auth
export const Auth = firebase.auth()
export const GoogleAuthProvider = new firebase.auth.GoogleAuthProvider()
