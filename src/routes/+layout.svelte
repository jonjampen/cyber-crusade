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
<slot></slot>