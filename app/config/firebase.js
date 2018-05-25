import * as firebase from 'firebase';
import 'firebase/firestore';

// firebase.initializeApp({
//     apiKey: 'AIzaSyDM4bfZawYFEvNsYlNyNZLEfTPSPsbtUkQ',
//     authDomain: 'tiecon-b3493.firebaseapp.com',
//     databaseURL: 'https://tiecon-b3493.firebaseio.com',
//     projectId: 'tiecon-b3493',
//     storageBucket: 'tiecon-b3493.appspot.com',
//     messagingSenderId: '489302991624'
// });

firebase.initializeApp({
    apiKey: "AIzaSyCzVXiljFFXW1p6-uvXAAXvfWVa0LTuC2g",
    authDomain: "tiecon-a9958.firebaseapp.com",
    databaseURL: "https://tiecon-a9958.firebaseio.com",
    projectId: "tiecon-a9958",
    storageBucket: "tiecon-a9958.appspot.com",
    messagingSenderId: "452511959689"
});
export const firestoreDB = firebase.firestore();

export default firebase;