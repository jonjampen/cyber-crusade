import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth, firebaseDb } from "../lib/firebase";
import { authUser } from '$lib/stores/authStore';
import { browser } from "$app/environment";
import { query, where, collection, getDocs } from "firebase/firestore";
import { randomName } from "$lib/randomName";

export async function load({ url }) {
    if (browser) {
        // keep updating auth
        onAuthStateChanged(firebaseAuth, async (user) => {
            if (user) {
                let users = await getDocs(query(collection(firebaseDb, "users"), where("uid", "==", user.uid)));
                let name = "";
                users.forEach(a => {
                    name = a.data().name
                })

                name = name || ""

                authUser.set({
                    uid: user.uid,
                    name: name,
                    email: user.email,
                })
            }
        });
    }

    return;
}
