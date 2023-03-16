<script>
import { app } from "./initializeFirebase";
import { getAuth, onAuthStateChanged } from "firebase/auth"
const auth = getAuth(app);


</script>
<slot></slot>