<script>
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, addDoc, collection, onSnapshot, getDocs, query, where } from "firebase/firestore";
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
    const db = getFirestore(app);
    const usersColl = collection(db, "users");

    onAuthStateChanged(auth, async (user) => {
        let theName;
        let users = await getDocs(query(usersColl, where("uid", "==", user.uid)))
        users.forEach(doc => {
            theName = doc.data().name;
        });
        authStore.set({
            isLoggedIn: user !== null,
            user,
            name: theName,
        })
    });
});
let loginState = false;
authStore.subscribe(async ({ isLoggedIn, user }) => {
    if (!isLoggedIn) {
        console.log("not logged in");
        loginState = false;
    }
    else {
        console.log("is logged in");
        loginState = true;
    }
});

</script>
<nav>
    <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/play">Join / Start game</a></li>
        <li><a href="/login">Login</a></li>
        <li><a href="/signup">Sign up</a></li>
        <li><a href="/signup">Sign up</a></li>
    </ul>
</nav>

{#if !loginState && $page.url.pathname !== "/login" && $page.url.pathname !== "/signup" && $page.url.pathname !== "/logout"}
    <a href="/login"><button>Go to login</button></a>
{:else}
    <slot></slot>
{/if}

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