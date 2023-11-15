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
        getDoc,
        updateDoc,
        deleteDoc,
    } from "firebase/firestore";
    import { onMount } from "svelte";
    import { startGame, createGame, joinGame } from "$lib/startGame";
    import { authUser } from "$lib/stores/authStore";
    import { playersStore } from "$lib/stores/playersStore";
    import { countOccurrences } from "$lib/gameplay/information";
    import { flipCard } from "$lib/gameplay/gameplay";

    const playersColl = collection(firebaseDb, "players");
    let gameRef;

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
            gameRef = await getDoc(doc(firebaseDb, "games", gameId.toString()));
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

    // finish game early
    async function endGame() {}

    // start new game & invite current players
    async function newGame() {
        let newGameId = await createGame("continue");
        $playersStore.forEach(async (player) => {
            await updateDoc(doc(firebaseDb, "players", player.id.toString()), {
                gameInvite: newGameId,
            });
        });
    }

    // leave current game
    async function leaveGame() {
        $playersStore.forEach(async (player) => {
            if (player.uid.toString() === $authUser.uid.toString()) {
                await deleteDoc(
                    doc(firebaseDb, "players", player.id.toString())
                );
                window.location.href = "/play";
                return false;
            }
            return true;
        });
    }

    $: $playersStore.forEach(async (player) => {
        if (
            player.uid.toString() === $authUser.uid.toString() &&
            player.gameInvite
        ) {
            if (
                confirm(
                    "Do you want to join the new game with id: " +
                        player.gameInvite +
                        "?"
                )
            ) {
                // delete player
                await deleteDoc(
                    doc(firebaseDb, "players", player.id.toString())
                );
                joinGame(player.gameInvite);
            } else {
                await updateDoc(
                    doc(firebaseDb, "players", player.id.toString()),
                    {
                        gameInvite: "",
                    }
                );
            }
        }
    });
</script>

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
            <p>
                {player.name}
                {#if player.uid.toString() === $authUser.uid.toString()}
                    <button on:click={leaveGame}>Leave</button>
                {/if}
            </p>
        {/each}
        <button on:click={startGame}>Start Game</button>
    </div>
{:else if $gameStore.gameState == "playing" || $gameStore.gameState == "clicked" || $gameStore.gameState == "roundEnded" || $gameStore.gameState == "over" || $gameStore.gameState == "dnf"}
    <div class="playing">
        <div class="sidenav">
            <p>Round: {$gameStore.round}/4</p>
            {#if $gameStore.gameState === "roundEnded"}
                <p>Round Ended</p>
            {/if}
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
            <button on:click={endGame}>End Game</button>
        </div>

        <div class="players">
            {#if $gameStore.gameState === "over" || $gameStore.gameState === "dnf"}
                <div class="player">
                    <p>Game over, {$gameStore.winner} won!</p>
                    <button on:click={newGame}>Play Again!</button>
                    <button on:click={leaveGame}>Leave Game</button>
                </div>
            {/if}
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
                                Firewall: {countOccurrences(player.cards)
                                    .firewall} <br />
                                Honeypot: {countOccurrences(player.cards)
                                    .honeypot} <br />
                                Target: {countOccurrences(player.cards).target}
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
