<script>
    import { signUpUser } from "./singup"
    let email, password, name;
    


</script>
<main class="login-page">
    <div class="login">
        <h1>Sign Up</h1>
        <form on:submit={signUpUser(name, email, password)} id="signUpForm">
            <div class="field">
                <label for="signUpNameInput">Name</label>
                <input type="text" name="name" id="signUpNameInput" bind:value={name} placeholder="John Doe">
            </div>
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
    </div>
</main>