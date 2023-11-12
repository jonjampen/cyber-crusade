<script>
    import { firebaseAuth } from "$lib/firebase";
    import { signOut } from "firebase/auth";
    import { goto } from "$app/navigation";

    signOut(firebaseAuth)
        .then(() => {
            // Sign-out successful.
            goto("/login");
        })
        .catch((error) => {
            console.log("not logged out");
            // An error happened.
        });
</script>
