import { app } from "../initializeFirebase";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, addDoc, collection } from "firebase/firestore";

const auth = getAuth(app);
const db = getFirestore(app);
const playersColl = collection(db, "players")

auth.onAuthStateChanged(user => {
    if (user) {
        let data = {
            dk: "asdfjalsdjfadklfjöalsdjf",
            name: "John",
            country: "USA"
        }
        addDoc(playersColl, data);          
    }
    else {
        console.log("no user")
    }
  });


export function signUpUser(email, password) {	

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        console.log("Logged in")
        const user = userCredential.user;
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage)
    });
}