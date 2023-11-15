<script>
    import { goto } from "$app/navigation";
    import { createUserWithEmailAndPassword } from "firebase/auth";
    import { firebaseAuth, firebaseDb } from "$lib/firebase";
    import { addDoc, collection } from "firebase/firestore";

    let email,
        password,
        name,
        success = undefined;

    function signUpUser() {
        createUserWithEmailAndPassword(firebaseAuth, email, password)
            .then(async (userCredential) => {
                let data = {
                    uid: userCredential.user.uid,
                    name: name,
                };
                await addDoc(collection(firebaseDb, "users"), data);
                goto("/play");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                success = false;
            });
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
                    placeholder="John Doe"
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
            </div>
        </form>
        <p>Already have an account? <a href="/login">Log In</a></p>
    </div>
</main>
