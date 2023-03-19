<script>
    function getCookieValue(name) {
        return document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || '' //https://stackoverflow.com/a/25490531/17760960
    }
    function joinGame() {
        console.log(getCookieValue("userData").email)
    }

</script>

<h1>Play!</h1>
<button on:click={joinGame}>Join Game</button>