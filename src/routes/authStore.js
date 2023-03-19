// https://phptuts.github.io/svelte-docs/firebase-recipe-site/login/

import { writable } from "svelte/store";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();

const authStore = writable({
    isLoggedIn: false,
    user: null,
});

export default {
    subscribe: authStore.subscribe,
    set: authStore.set,
}

onAuthStateChanged(auth, (user) => {
    authStore.set({
      isLoggedIn: user !== null,
      user,
    });
  });