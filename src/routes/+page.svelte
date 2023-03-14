<script>
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "./initializeFirebase";

let email, password;
const auth = getAuth(app);

function signUpUser() {	
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage)
    });
}
</script>

<form on:submit={signUpUser} id="signUpForm">
    <input type="text" name="email" id="signUpEmailInput" bind:value={email}>
    <input type="password" name="password" id="signUpPasswordInput" bind:value={password}>
    <button type="submit" id="signupSubmit">Sign Up</button>
</form>