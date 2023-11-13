<script>
    import { firebaseDb } from "$lib/firebase.js";
    import { gameStore } from "$lib/gameStore";
    import {
        addDoc,
        collection,
        onSnapshot,
        getDocs,
        where,
        query,
        updateDoc,
        doc,
        setDoc,
        getDoc,
        deleteDoc,
    } from "firebase/firestore";
    import { onMount } from "svelte";
    import { startGame } from "$lib/startGame";
    import { authUser } from "$lib/authStore";
    import { playersStore } from "$lib/playersStore";

    export let data;
    let allPlayers = [];
    const playersColl = collection(firebaseDb, "players");

    onMount(async () => {
        // get current game: get player + gameid by userid -> get game by id
        let user;
        let gameId = "";
        authUser.subscribe((val) => (user = val));

        let playersColl = collection(firebaseDb, "players");
        let users = await getDocs(
            query(playersColl, where("uid", "==", user.uid))
        );
        users.forEach((doc) => {
            gameId = doc.data().gameId;
        });

        // keep updating game
        let gameData;
        if (gameId) {
            let unsubscribeGame = onSnapshot(
                doc(firebaseDb, "games", gameId.toString()),
                (doc) => {
                    gameData = doc.data();
                    $gameStore = {
                        id: gameId.toString(),
                        round: 0,
                        state: gameData.gameState,
                    };
                    $gameStore.id = gameId.toString();
                    // $gameStore = {}
                }
            );
        }

        // update players infos
        let unsubscribePlayers = onSnapshot(playersColl, async (snapshot) => {
            snapshot.docs.forEach((player) => {
                if (player.data().gameId.toString() === $gameStore.id) {
                    allPlayers.push({
                        ...player.data(),
                        id: player.id,
                    });
                }
            });
            $playersStore = allPlayers;
        });
    });
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
        {#each $playersStore as player}
            <p>{player.name}</p>
        {/each}
        <button on:click={startGame}>Start Game</button>
    </div>
{/if}
