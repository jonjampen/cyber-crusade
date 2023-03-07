import { app } from "./initializeFirebase";
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";
import {
     getAuth, onAuthStateChanged,
     signInAnonymously
} from 'firebase/auth';
import { randomName } from "./randomName";

const auth = getAuth(app);
const db = getFirestore();
const playersColl = collection(db, 'players');
export const userData = {};

onAuthStateChanged(auth, async (user) => {
    // if logged in
    if (user) {
        // get amount of docs from coll that have the same uid
        let uidInDB;
        await getDocs(query(playersColl, where("uid", "==", user.uid))).then((snapshot) => {
            uidInDB = snapshot.docs.length;
        });

        // create display name
        let displayName = randomName();

        // if user not yet in db, create user
        if (uidInDB == 0) {
            addDoc(playersColl, {
                uid: auth.currentUser.uid,
                name: displayName
            });
        }
        userData.id = user.uid;
        userData.displayName = displayName;
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