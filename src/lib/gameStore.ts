import { writable } from 'svelte/store';

interface Game {
    id: string;
    round: number;
}

const gameStore = writable<Game>({
    id: "",
    round: 0,
});

export { gameStore };