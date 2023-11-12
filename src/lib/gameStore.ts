import { writable } from 'svelte/store';

interface Game {
    id: string;
    round: number;
    state: string;
}

const gameStore = writable<Game>({
    id: "",
    round: 0,
    state: "",
});

export { gameStore };