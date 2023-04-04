<script>
    import { signUpUser } from "./login"
    
    let email, password;
    
</script>
<main class="login-page">
    <div class="login">
        <h1>Log In</h1>
        <form on:submit={signUpUser(email, password)} id="signUpForm">
            <div class="field">
                <label for="signUpEmailInput">Email</label>
                <input type="text" name="email" id="signUpEmailInput" bind:value={email} placeholder="name@example.com">
            </div>
            <div class="field">
                <label for="signUpPasswordInput">Password</label>
                <input type="password" name="password" id="signUpPasswordInput" bind:value={password} placeholder="••••••••">
            </div>
            <div class="field">
                <button type="submit" id="signupSubmit">Sign Up</button>
            </div>
        </form>
        <p>Don't have an account yet? <a href="/signup">Sign Up</a></p>
    </div>
</main>