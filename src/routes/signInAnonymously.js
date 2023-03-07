import { app } from "./initializeFirebase";
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";
import {
     getAuth, onAuthStateChanged,
     signInAnonymously
} from 'firebase/auth';

const auth = getAuth(app);
const db = getFirestore();
const playersColl = collection(db, 'players');

onAuthStateChanged(auth, async (user) => {
    // if logged in
    if (user) {
        // get amount of docs from coll that have the same uid
        let uidInDB;
        await getDocs(query(playersColl, where("uid", "==", user.uid))).then((snapshot) => {
            uidInDB = snapshot.docs.length;
        });

        // if user not yet in db, create user
        if (uidInDB == 0) {
            addDoc(playersColl, {
                uid: auth.currentUser.uid,
                name: "fritz"
            });
        }
    }
})

// sign in
signInAnonymously(auth)
    .then(() => {
        console.log("Logged in");
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode + errorMessage)
    });