<script>
    import authStore from "../../stores/authStore";
    import {goto} from "$app/navigation";
    import { browser } from "$app/environment";

    authStore.subscribe(async ({ isLoggedIn, user }) => {
        if (!isLoggedIn) {
            console.log("not logged in");
            // await goto("/login")
        }
        else {
            console.log("is logged in");
            console.log(user);
        }
    })


    function getCookieValue(name) {
        return document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || '' //https://stackoverflow.com/a/25490531/17760960
    }
    function joinGame() {
        console.log(getCookieValue("userData").email)
    }

</script>

<h1>Play!</h1>
<button on:click={joinGame}>Join Game</button>