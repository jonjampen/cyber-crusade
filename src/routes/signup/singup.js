import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "../initializeFirebase";


export function signUpUser(email, password) {	
    const auth = getAuth(app);

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