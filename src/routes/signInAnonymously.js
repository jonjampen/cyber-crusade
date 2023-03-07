import { app } from "./initializeFirebase";
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";
import {
     getAuth, onAuthStateChanged,
     signInAnonymously
} from 'firebase/auth';

const auth = getAuth(app);
export let player = auth.currentUser
const db = getFirestore();
const playersColl = collection(db, 'players');

let isUser = null;
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // get users from db that have the same uid
        await getDocs(query(playersColl, where("uid", "==", user.uid))).then((snapshot) => {
            isUser = snapshot.docs.length;
        });

        console.log("outside" + isUser);
        // check user exists in db
        if (isUser == 0) {
            addDoc(playersColl, {
                uid: auth.currentUser.uid,
                name: "fritz"
            });
        }
        // getDocs(query(playersColl, where("uid", "==", 37)))
        //     .then((snapshot) => {
        //         console.log(snapshot.docs[0])
        //     })

    }
})

signInAnonymously(auth)
// sign in
    .then(() => {
        console.log("Logged in");
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode + errorMessage)
    });