import { writable } from 'svelte/store';

interface AuthUser {
    uid: string;
    name: string;
    email: string;
}

const authUser = writable<AuthUser>({
    uid: "",
    name: "",
    email: "",
});

export { authUser };