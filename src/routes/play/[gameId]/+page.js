import { gameStore } from "$lib/stores/gameStore"
import { redirect } from "@sveltejs/kit";

export const load = ({ params }) => {
    return {
        gameId: params.gameId
    }
}