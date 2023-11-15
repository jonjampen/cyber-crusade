<script>
    import { randomName } from "$lib/randomName";
    import { goto } from "$app/navigation";
    import {
        createUserWithEmailAndPassword,
        signInAnonymously,
        GoogleAuthProvider,
        signInWithPopup,
    } from "firebase/auth";
    import { firebaseAuth, firebaseDb } from "$lib/firebase";
    import { addDoc, collection } from "firebase/firestore";

    let email,
        password,
        name,
        success = undefined;

    function signUpUser() {
        createUserWithEmailAndPassword(firebaseAuth, email, password)
            .then(async (userCredential) => {
                await basicSignUp(userCredential);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                success = false;
            });
    }

    async function signInGuest() {
        if (
            confirm(
                "Signing in as a guest means that your game data will NOT be saved and you can not log back in in the future."
            )
        ) {
            signInAnonymously(firebaseAuth)
                .then(async (userCredential) => {
                    await basicSignUp(userCredential);
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorCode, errorMessage);
                    success = false;
                });
        } else {
            return;
        }
    }

    async function basicSignUp(userCredential) {
        name = name || randomName();
        let data = {
            uid: userCredential.user.uid,
            name: name,
        };
        await addDoc(collection(firebaseDb, "users"), data);
        goto("/play");
    }
</script>

<main class="login-page">
    <div class="login">
        <h1>Sign Up</h1>
        {#if !success && success !== undefined}
            <div class="p-8 text-red-500 bg-red-100">
                There was an error registering. Please try again.
            </div>
        {/if}
        <form on:submit|preventDefault={signUpUser} id="signUpForm">
            <div class="field">
                <label for="signUpNameInput">Name</label>
                <input
                    type="text"
                    name="name"
                    id="signUpNameInput"
                    bind:value={name}
                    placeholder="Leave empty for cool nick name ;-)"
                />
            </div>
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
                <button type="submit" id="signupSubmit">Sign Up</button>
                <!-- <p class="or"><span>or</span></p> -->
                <!-- <button on:click={signInGuest} class="guest"
                    >Sign In as a Guest</button
                > -->
                <!-- <button on:click={signInGoogle}>Sign In with Google</button> -->
            </div>
        </form>
        <p>Already have an account? <a href="/login">Log In</a></p>
    </div>
</main>
