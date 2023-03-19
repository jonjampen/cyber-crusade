<script>
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { goto } from "$app/navigation";
import { page } from "$app/stores";
import { onMount } from "svelte";
import authStore from "../stores/authStore"

onMount(() => {
    const firebaseConfig = {
        apiKey: "AIzaSyBgGsxHQnm4A_QanvUuibQIuWvg0vnKZOs",
        authDomain: "the-cyber-crusade.firebaseapp.com",
        projectId: "the-cyber-crusade",
        storageBucket: "the-cyber-crusade.appspot.com",
        messagingSenderId: "249426335271",
        appId: "1:249426335271:web:907f9c9d16ace85dfe6002"
    };
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    onAuthStateChanged(auth, (user) => {
        authStore.set({
            isLoggedIn: user !== null,
            user,
        })
    })
})

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

    <h1></h1>
    <h1></h1>

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