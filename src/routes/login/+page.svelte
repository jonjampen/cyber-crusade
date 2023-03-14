<script>
    import { signUpUser } from "./login"
    
    let email, password;
    
</script>
    <h1>Log In</h1>
    <form on:submit={signUpUser(email, password)} id="signUpForm">
        <input type="text" name="email" id="signUpEmailInput" bind:value={email}>
        <input type="password" name="password" id="signUpPasswordInput" bind:value={password}>
        <button type="submit" id="signupSubmit">Sign Up</button>
    </form>