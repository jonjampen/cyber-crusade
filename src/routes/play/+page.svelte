<script>
    import { authUser } from "$lib/authStore";
    import { createGame, joinGame } from "$lib/startGame";
    import {
        getFirestore,
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
    import { firebaseDb } from "$lib/firebase.js";
    import { gameStore } from "$lib/gameStore";

    let gameId = "";
</script>

<h1>Welcome {$authUser.name}</h1>

{#if $gameStore.id}
    <h3>Your active games</h3>
    <ul>
        <li><a href="/play/{$gameStore.id}">{$gameStore.id}</a></li>
    </ul>
{/if}

<h3>Join a Game</h3>
<form on:submit|preventDefault={() => joinGame(gameId.value)}>
    <label>
        Game Code
        <input
            bind:this={gameId}
            type="text"
            name="gameId"
            id="gameId"
            placeholder="XXXXXX"
        />
    </label>
    <button type="submit">Join Game</button>
</form>

<h3>Create New Game</h3>
<button on:click={createGame}>Create Game</button>
