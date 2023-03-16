<script>
    import { signUpUser } from "./singup"
    let email, password, name;
    


</script>
    <h1>Sign Up</h1>
    <form on:submit={signUpUser(name, email, password)} id="signUpForm">
        <input type="text" name="name" id="signUpNameInput" bind:value={name}>
        <input type="text" name="email" id="signUpEmailInput" bind:value={email}>
        <input type="password" name="password" id="signUpPasswordInput" bind:value={password}>
        <button type="submit" id="signupSubmit">Sign Up</button>
    </form>