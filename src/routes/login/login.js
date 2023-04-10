import { getAuth, signInWithEmailAndPassword } from "firebase/auth";


export function signUpUser(email, password) {	
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
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