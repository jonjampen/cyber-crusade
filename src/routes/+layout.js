import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../lib/firebase";
import { authUser } from '$lib/authStore';
import { browser } from "$app/environment";

export async function load({ url }) {
    if (browser) {
        onAuthStateChanged(firebaseAuth, (user) => {
            if (user) {
                authUser.set({
                    uid: user.uid,
                    name: "Peter",
                    email: user.email,
                })
            }
        });
    }

    return;
}
