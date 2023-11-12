<script>
    import { firebaseAuth } from "$lib/firebase";
    import { signOut } from "firebase/auth";
    import { goto } from "$app/navigation";

    signOut(firebaseAuth)
        .then(() => {
            goto("/login");
        })
        .catch((error) => {
            console.error(error);
        });
</script>
