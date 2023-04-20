import { app } from "../initializeFirebase";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, addDoc, collection } from "firebase/firestore";

const auth = getAuth(app);
const db = getFirestore(app);
const playersColl = collection(db, "users")

export async function signUpUser(name, email, password) {
    createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
        let data = {
            uid: userCredential.user.uid,
            name: name,
        }
        await addDoc(playersColl, data)

        console.log("Logged in")
        const user = userCredential.user;
        window.location = '/play';
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage)
    });
}