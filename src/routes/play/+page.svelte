<script>
    import authStore from "../../stores/authStore";
    import { app } from "../initializeFirebase";
    import { getAuth } from "firebase/auth";
    import { getFirestore, addDoc, collection, onSnapshot } from "firebase/firestore";
    
    let playState = null;
    const auth = getAuth(app);
    const db = getFirestore(app);
    const playersColl = collection(db, "players")

    // check if already in players collection and set playState

    function joinGame() {
        authStore.subscribe(async ({ user }) => {
            if (user) {

                let data = {
                    uid: user.uid,
                }
                addDoc(playersColl, data);
                playState = "joined";

                console.log(user.email)
            }
        });
    }

    //subscribe to players collection to display all players
    let allPlayers = [];
    onSnapshot(playersColl, (snapshot) => {
        snapshot.docs.forEach((doc) => {
            allPlayers.push({ ...doc.data()})
        })
        console.log(allPlayers)
    })
</script>

<h1>Play!</h1>

{#if !playState}
    <button on:click={joinGame}>Join Game</button>
{:else if playState == "joined"}
    <p>You joined the game</p>
    {#each allPlayers as player}
        <p>{player.uid}</p>
    {/each}
{/if}