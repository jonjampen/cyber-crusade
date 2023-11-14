<script>
    import { firebaseDb } from "$lib/firebase.js";
    import { gameStore } from "$lib/stores/gameStore";
    import {
        collection,
        onSnapshot,
        getDocs,
        where,
        query,
        doc,
    } from "firebase/firestore";
    import { onMount } from "svelte";
    import { startGame } from "$lib/startGame";
    import { authUser } from "$lib/stores/authStore";
    import { playersStore } from "$lib/stores/playersStore";
    import { countOccurrences } from "$lib/gameplay/information";
    import { flipCard } from "$lib/gameplay/gameplay";

    const playersColl = collection(firebaseDb, "players");

    onMount(async () => {
        // get current game
        let gameId = "";
        let users = await getDocs(
            query(playersColl, where("uid", "==", $authUser.uid))
        );
        users.forEach((doc) => {
            gameId = doc.data().gameId;
        });

        // keep updating game
        if (gameId) {
            let unsubscribeGame = onSnapshot(
                doc(firebaseDb, "games", gameId.toString()),
                (doc) => {
                    $gameStore = { ...doc.data(), id: doc.id };
                }
            );
        }

        // keep updating players infos
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

    console.log($gameStore);
</script>

{$gameStore.gameState != "roundEnded"}
{$gameStore.gameState}
{$gameStore.currentPlayer}
{#each $playersStore as player}
    <p>
        {player.name}
        {player.id}
        game: {player.gameId}
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
{:else if $gameStore.gameState == "playing" || $gameStore.gameState == "clicked"}
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
                                        $authUser.uid &&
                                    player.uid != $authUser.uid &&
                                    card.turned != true &&
                                    $gameStore.gameState == 'playing'
                                        ? 'clickable'
                                        : ''} card"
                                    playerid={player.id}
                                    cardindex={i}
                                    on:click={$gameStore.currentPlayer ==
                                        $authUser.uid &&
                                    player.uid != $authUser.uid &&
                                    card.turned != true &&
                                    $gameStore.gameState == "playing"
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
