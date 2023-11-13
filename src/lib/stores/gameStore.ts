import { writable } from 'svelte/store';
const gameStore = writable({
    id: "",
});

export { gameStore };