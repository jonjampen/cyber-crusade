import { writable } from 'svelte/store';

const playersStore = writable([]);

export { playersStore };