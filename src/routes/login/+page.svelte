<script>
    import {
        signInWithEmailAndPassword,
        setPersistence,
        browserSessionPersistence,
    } from "firebase/auth";
    import { firebaseAuth } from "$lib/firebase";
    import { authUser } from "$lib/authStore";

    let email,
        password,
        success = undefined;

    export function loginUser() {
        setPersistence(firebaseAuth, browserSessionPersistence)
            .then(() => {
                // Existing and future Auth states are now persisted in the current
                // session only. Closing the window would clear any existing state even
                // if a user forgets to sign out.
                // ...
                // New sign-in will be persisted with session persistence.
                signInWithEmailAndPassword(firebaseAuth, email, password).then(
                    (userCredential) => {
                        $authUser = {
                            uid: userCredential.user.uid,
                            name: userCredential.user.name,
                            email: userCredential.user.email || "",
                        };
                        window.location.href = "/play";
                    }
                );
            })
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                success = false;
            });

        // signInWithEmailAndPassword(firebaseAuth, email, password)
        //     .then((userCredential) => {
        //         $authUser = {
        //             uid: userCredential.user.uid,
        //             name: userCredential.user.name,
        //             email: userCredential.user.email || "",
        //         };

        //         goto("/play");
        //     })
        //     .catch((error) => {
        //         const errorCode = error.code;
        //         const errorMessage = error.message;
        //         console.log(errorCode, errorMessage);

        //         success = false;
        //     });
    }
</script>

<main class="login-page">
    <div class="login">
        <h1>Log In</h1>
        {#if !success && success !== undefined}
            <div>There was an error logging in. Please try again.</div>
        {/if}
        <form on:submit|preventDefault={loginUser} id="signUpForm">
            <div class="field">
                <label for="signUpEmailInput">Email</label>
                <input
                    type="text"
                    name="email"
                    id="signUpEmailInput"
                    bind:value={email}
                    placeholder="name@example.com"
                />
            </div>
            <div class="field">
                <label for="signUpPasswordInput">Password</label>
                <input
                    type="password"
                    name="password"
                    id="signUpPasswordInput"
                    bind:value={password}
                    placeholder="••••••••"
                />
            </div>
            <div class="field">
                <button type="submit" id="signupSubmit">Log In</button>
            </div>
        </form>
        <p>Don't have an account yet? <a href="/signup">Sign Up</a></p>
    </div>
</main>
