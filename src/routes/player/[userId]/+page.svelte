<script>
    import { authUser } from "$lib/stores/authStore";
    import { collection, getDocs, where, query } from "firebase/firestore";
    import { onMount } from "svelte";
    import { firebaseDb } from "$lib/firebase.js";

    let wins = [],
        losses = [],
        games = [];

    onMount(async () => {
        let gamesDb = await getDocs(
            query(
                collection(firebaseDb, "games"),
                where("playerIds", "array-contains", $authUser.uid)
            )
        );

        gamesDb.forEach((game) => {
            games = [...games, game.data()];

            game.data().players.forEach((player) => {
                // check wins
                if (player.uid == $authUser.uid) {
                    if (player.role === game.data().winner) {
                        wins = [...wins, player];
                    } else {
                        losses = [...losses, player];
                    }
                }
            });
        });
    });
</script>

<p class="name">{$authUser.name} <a href="/logout">Logout</a></p>
<p>Games: {games.length}</p>
<p>Wins: {wins.length}</p>
<p>Losses: {losses.length}</p>
