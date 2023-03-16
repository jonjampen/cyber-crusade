<script>
import { onMount } from "svelte";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { goto } from "$app/navigation";
import { app } from "./initializeFirebase";
import { page } from "$app/stores";


// onMount(() => {
//     const auth = getAuth(app);
//     onAuthStateChanged(auth, (user) => {
//         if (user) {
//             console.log("Hello")
//         }
//         else {
//             if (page.pathname != "login" || page.pathname != "signup") {
//                 goto("/login")
//             }
//         }
//     })
// })

</script>
<nav>
    <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/game">Game</a></li>
        <li><a href="/login">Login</a></li>
        <li><a href="/signup">Sign up</a></li>
    </ul>
</nav>
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