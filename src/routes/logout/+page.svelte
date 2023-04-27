<script>
import { getAuth, signOut } from "firebase/auth";
import { app } from "../initializeFirebase";

const auth = getAuth(app);

signOut(auth).then(() => {
  // Sign-out successful.
  console.log("logged out")
  window.location.href="/login";
}).catch((error) => {
    console.log("not logged out")
  // An error happened.
});    
</script>