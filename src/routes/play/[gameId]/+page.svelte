<script>
    import { firebaseDb } from "$lib/firebase.js";
    import { gameStore } from "$lib/gameStore";
    import { collection, onSnapshot } from "firebase/firestore";
    import { onMount } from "svelte";
    export let data;
    let allPlayers = [];
    const playersColl = collection(firebaseDb, "players");

    onMount(async () => {
        // update players infos
        onSnapshot(playersColl, async (snapshot) => {
            snapshot.docs.forEach((player) => {
                allPlayers.push({
                    ...player.data(),
                    id: player.id,
                });
            });
        });
    });

    function startGame() {}
</script>

{data.gameId}
{#if $gameStore.state == "created"}
    <div class="waiting">
        <h1>Waiting Room</h1>
        <p>
            Join the game at <a href="https://cyber-crusade.vercel.app"
                >cyber-crusade.vercel.app</a
            > with the game ID:
        </p>
        <h2><span>{$gameStore.id}</span></h2>
        <h4>Players:</h4>
        {#each allPlayers as player}
            <p>{player.name}</p>
        {/each}
        <button on:click={startGame}>Start Game</button>
    </div>
{/if}
