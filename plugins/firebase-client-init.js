/**
 * Firebase/Firestore SDK
 */
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/functions';

/**
 * Our custom extensions/methods to Firestore
 */
import request from './extensions/request';

/**
 * Initialize our app
 */
export default !firebase.apps.length ? firebase.initializeApp(process.env.FIREBASE_CONFIG) : firebase.app()

/**
 * Apply our extensions/methods
 */
firebase.firestore.DocumentSnapshot.prototype.request = request;


// Export Firestore
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
