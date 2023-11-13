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
    const playersColl = collection(firebaseDb, "players");

    onMount(async () => {
        // get current game: get player + gameid by userid -> get game by id
        let user;
        let gameId = "";
        authUser.subscribe((val) => (user = val));

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
                    // $gameStore = {
                    //     id: gameId.toString(),
                    //     round: 0,
                    //     state: gameData.gameState,
                    // };
                    // $gameStore.id = gameId.toString();
                    $gameStore = { ...doc.data(), id: doc.id };
                }
            );
        }

        // update players infos
        if (gameId) {
            let unsubscribePlayers = onSnapshot(
                playersColl,
                async (snapshot) => {
                    let updatedPlayers = [];
                    snapshot.docs.forEach((player) => {
                        if (player.data().gameId.toString() === $gameStore.id) {
                            updatedPlayers.push({
                                ...player.data(),
                                id: player.id,
                            });
                        }
                    });
                    $playersStore = updatedPlayers;
                }
            );
        }
        return () => {
            unsubscribeGame();
            unsubscribePlayers();
        };
    });

    function countOccurrences() {
        let cards = [];
        $playersStore.forEach((player) => {
            if (player.uid === $authUser.uid) {
                cards = player.cards;
            }
        });
        // Initialize counters
        let targetCount = 0;
        let firewallCount = 0;
        let honeypotCount = 0;

        // Iterate through the cards array
        cards.forEach((card) => {
            switch (card.value) {
                case "target":
                    targetCount++;
                    break;
                case "firewall":
                    firewallCount++;
                    break;
                case "honeypot":
                    honeypotCount++;
                    break;
            }
        });

        return {
            target: targetCount,
            firewall: firewallCount,
            honeypot: honeypotCount,
        };
    }

    $: console.log($playersStore);
</script>

{#each $playersStore as player}
    <p>
        {player.name}
        {player.id}
        {player.gameId}
        {#if player.role}
            {player.role}
        {/if}
    </p>
{/each}
{#if $gameStore.gameState == "created"}
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
{:else if $gameStore.gameState == "playing"}
    <div class="playing">
        <div class="sidenav">
            <p>Round: {$gameStore.round}/4</p>
            <hr />
            <p>
                Target: {$gameStore.startCards.target -
                    $gameStore.cards.target}/{$gameStore.startCards.target}
            </p>
            <p>
                Honeypot: {$gameStore.startCards.honeypot -
                    $gameStore.cards.honeypot}/{$gameStore.startCards.honeypot}
            </p>
            <p>
                Firewall: {$gameStore.startCards.firewall -
                    $gameStore.cards.firewall}/{$gameStore.startCards.firewall}
            </p>
            <hr />
            <p>
                Hacker 👨‍💻: {$gameStore.startRoles.hacker}
            </p>
            <p>
                Agent 🕵️: {$gameStore.startRoles.agent}
            </p>
            <hr />
            <button>Start New Game</button>
        </div>

        <div class="players">
            {#each $playersStore as player}
                {#if player.gameId.toString() === $gameStore.id}
                    <div
                        class="player {player.uid == $authUser.uid
                            ? 'thisPlayer'
                            : ''} {$gameStore.currentPlayer == player.uid
                            ? 'activePlayer'
                            : ''}"
                    >
                        <div class="player-info">
                            <h3>
                                {player.name}

                                {#if player.uid == $authUser.uid || $gameStore.gameState == "over"}
                                    <span
                                        title={player.role == "Agent"
                                            ? "Agent: try to direct hackers to honeypots."
                                            : "Hacker: try to find targets."}
                                        >{player.role == "Agent"
                                            ? "🕵️"
                                            : "👨‍💻"}</span
                                    >
                                {/if}
                            </h3>
                            {#if player.uid == $authUser.uid}
                                Firewall: {countOccurrences().firewall} <br />
                                Honeypot: {countOccurrences().honeypot} <br />
                                Target: {countOccurrences().target}
                            {/if}
                        </div>
                        <div class="cards">
                            {#each player.cards as card, i}
                                <img
                                    class="{$gameStore.currentPlayer ==
                                        $playersStore.uid &&
                                    player.uid != $playersStore.uid &&
                                    card.turned != true
                                        ? 'clickable'
                                        : ''} card"
                                    playerid={player.id}
                                    cardindex={i}
                                    on:click={$gameStore.currentPlayer ==
                                        $playersStore.uid &&
                                    player.uid != $playersStore.uid &&
                                    card.turned != true
                                        ? flipCard
                                        : ""}
                                    src="/computers/{card.turned == true
                                        ? card.value
                                        : 'flipped'}.svg"
                                />
                            {/each}
                        </div>
                    </div>
                {/if}
            {/each}
        </div>
    </div>
{/if}
