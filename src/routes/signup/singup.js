import { app } from "../initializeFirebase";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, addDoc, collection } from "firebase/firestore";

const auth = getAuth(app);
const db = getFirestore(app);
const playersColl = collection(db, "users")

export function signUpUser(name, email, password) {
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        let data = {
            uid: userCredential.user.uid,
            name: name,
        }
        addDoc(playersColl, data);

        console.log("Logged in")
        const user = userCredential.user;
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage)
    });
}