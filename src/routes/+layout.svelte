<script>
    import "../style.css";
    import { page } from "$app/stores";
    import { authUser } from "$lib/stores/authStore";
</script>

<nav>
    <ul>
        <li><a href="/">Instructions</a></li>
        {#if $authUser.uid}
            <li><a href="/play">Play Game</a></li>
            <li><a href="/player/{$authUser.uid}">Profile</a></li>
        {:else}
            <li><a href="/login">Login</a></li>
            <li><a href="/signup">Sign up</a></li>
        {/if}
        <li>
            <a
                target="_blank"
                href="https://www.github.com/jonjampen/cyber-crusade"
                ><img
                    height="32px"
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
                /></a
            >
        </li>
    </ul>
</nav>

{#if !$authUser.uid && $page.url.pathname !== "/login" && $page.url.pathname !== "/signup" && $page.url.pathname !== "/logout" && $page.url.pathname !== "/"}
    <h3>Please Log in first</h3>
    <p>If you are already logged in, the game will start shortly.</p>
    <a href="/login"><button>Go to login</button></a>
{:else}
    <slot />
{/if}

<style>
    nav ul,
    a {
        list-style-type: none;
        text-decoration: none;
        color: orange;
        height: 32px;
    }
    nav ul {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: end;
        gap: 32px;
    }
</style>
