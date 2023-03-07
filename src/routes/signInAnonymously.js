import { app } from "./initializeFirebase";
import { getFirestore, collection, addDoc } from "firebase/firestore";

import {
     getAuth, onAuthStateChanged,
     signInAnonymously
} from 'firebase/auth';
export let userID;

const auth = getAuth(app);
const db = getFirestore();
const playersRef = collection(db, 'players');

onAuthStateChanged(auth, (user) => {
    if (user) {
        userID = user.uid;
        addDoc(playersRef, {
            uid: userID,
            name: "david"
        })
    }
})

// sign in
signInAnonymously(auth)
    .then(() => {
        console.log(userID);
        // Signed in...
        console.log("Logged in")
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode + errorMessage)
    });