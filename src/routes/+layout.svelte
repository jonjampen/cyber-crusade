<script>
    import "$lib/style.css";
    import { page } from "$app/stores";
    import { authUser } from "$lib/authStore";
</script>

{#if !$authUser.uid && $page.url.pathname !== "/login" && $page.url.pathname !== "/signup" && $page.url.pathname !== "/logout" && $page.url.pathname !== "/"}
    <h3>Please Log in first</h3>
    <p>If you are already logged in, the game will start shortly.</p>
    <a href="/login"><button>Go to login</button></a>
{:else}
    <slot />
{/if}
