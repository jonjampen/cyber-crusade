<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { goto } from "$app/navigation";
import { app } from "./initializeFirebase";
import { page } from "$app/stores";

const auth = getAuth();
let user = onAuthStateChanged(auth, (user) => {
  if (user) {

    console.log("User signed in")
    const uid = user.uid;
    console.log(user)
    // return user
    // ...
  } else {
    // User is signed out
    console.log("User is not signed in")
    console.log("page:" + $page.url.pathname)
    if (!$page.url.pathname.includes("login") && !$page.url.pathname.includes("signup")) {
        console.log("Redirect")
        
    }
  }
});

</script>
<nav>
    <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/game">Game</a></li>
        <li><a href="/login">Login</a></li>
        <li><a href="/signup">Sign up</a></li>
    </ul>
</nav>

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