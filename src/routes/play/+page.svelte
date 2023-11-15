<script>
    import { authUser } from "$lib/stores/authStore";
    import { createGame, joinGame } from "$lib/startGame";
    import { gameStore } from "$lib/stores/gameStore";

    let gameId = "";
</script>

<h1>Welcome {$authUser.name}</h1>

{#if $gameStore.id}
    <h3>Your active games</h3>
    <ul>
        <li><a href="/play/{$gameStore.id}">{$gameStore.id}</a></li>
    </ul>
    <br />
{/if}

<h3>Join a Game</h3>
<form class="join" on:submit|preventDefault={() => joinGame(gameId.value)}>
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
<br />

<h3>Create New Game</h3>
<button on:click={createGame}>Create Game</button>
