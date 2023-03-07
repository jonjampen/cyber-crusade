 import { app } from "./initializeFirebase";

 import {
     getAuth,
     signInAnonymously
 } from 'firebase/auth';


 const auth = getAuth(app);

 // sign in
 signInAnonymously(auth)
    .then(() => {
        // Signed in...
        console.log("Logged in")
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log(errorCode + errorMessage)
    });