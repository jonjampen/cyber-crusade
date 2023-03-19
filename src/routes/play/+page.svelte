<script>
    import authStore from "../../stores/authStore";
    import { app } from "../initializeFirebase";
    import { getAuth } from "firebase/auth";
    import { getFirestore, addDoc, collection } from "firebase/firestore";
    
    let playState = null;

    function joinGame() {

        authStore.subscribe(async ({ user }) => {
            if (user) {
                // check if already in players collection
                const auth = getAuth(app);
                const db = getFirestore(app);
                const playersColl = collection(db, "players")

                let data = {
                    uid: user.uid,
                }
                addDoc(playersColl, data);
                playState = "joined";

                console.log(user.email)
            }
        });
    }

    //subscribe to players collection

</script>

<h1>Play!</h1>

{#if !playState}
    <button on:click={joinGame}>Join Game</button>
{:else if playState == "joined"}
    <p>You joined the game</p>
{/if}