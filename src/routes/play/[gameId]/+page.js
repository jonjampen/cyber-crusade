import { gameStore } from "$lib/gameStore"
import { redirect } from "@sveltejs/kit";

export const load = ({ params }) => {
    let game;
    gameStore.subscribe(val => game = val);

    // redirect if not in that game
    if (params.gameId != game.id) {
        throw redirect(302, "/play")
    }

    return {
        gameId: params.gameId
    }
}