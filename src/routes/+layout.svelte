<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { goto } from "$app/navigation";
import { app } from "./initializeFirebase";
import { page } from "$app/stores";
import { onMount } from "svelte";

const auth = getAuth();

let userData = {"uid": "", "email": ""};

// onMount(() => {
//     onAuthStateChanged(auth, (user) => {
//         if (user) {
//             console.log("User signed in")

//             userData = {
//                 "uid": user.uid,
//                 "email": user.email,
//             }
//             console.log(user.email)
//             // ...
//         } else {
//             // User is signed out
//             console.log("User is not signed in")
//             console.log("page:" + $page.url.pathname)
//             if (!$page.url.pathname.includes("login") && !$page.url.pathname.includes("signup")) {
//                 console.log("Redirect")
//                 goto("/login")
//             }
//         }
//     });
// })
import authStore from "./authStore";

authStore.subscribe(async ({ isLoggedIn }) => {
  if (!isLoggedIn) {
    await goto("/login");
  }
});
</script>
<nav>
    <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/game">Game</a></li>
        <li><a href="/login">Login</a></li>
        <li><a href="/signup">Sign up</a></li>
        <li><a href="/signup">Sign up</a></li>
    </ul>
</nav>

    <h1>{userData.email}</h1>
    <h1>authStore: {get(authStore)}</h1>

<!-- wait for user -->
<slot></slot>

<style>
    nav ul, a {
        list-style-type: none;
        text-decoration: none;
        color: orange;
        height: 32px;
    }
    nav ul {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: end;
        gap: 32px;
    }
</style>