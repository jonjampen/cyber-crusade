import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "./initializeFirebase";
import { redirect } from '@sveltejs/kit';



export async function load({ url }) {
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
        if (user) {
            //? Why do I never get here?
            console.log("Hello, you are logged in")
        }
        else {
            console.log("Not logged in!")
            console.log(url.pathname)
            if (!url.pathname.includes("login") && !url.pathname.includes("signup")) {
                console.log("Not on login/signup. To be redirected")
                //? How to redirect?
            }
            else {
                return
            }
        }
    })
}