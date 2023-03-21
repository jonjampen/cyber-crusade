<script>
    import authStore from "../../stores/authStore";
    import { app } from "../initializeFirebase";
    import { getAuth } from "firebase/auth";
    import { getFirestore, addDoc, collection, onSnapshot, getDocs, query, where } from "firebase/firestore";
    
    let playState = null;
    const db = getFirestore(app);
    const playersColl = collection(db, "players")

    // check if already in players collection and set playState

    function joinGame() {
        authStore.subscribe(async ({ user, name }) => {
            if (user) {
                if (!allPlayers.includes(name)) {   
                    console.log(name) 
                    let data = {
                        uid: user.uid,
                        name: name,
                    }
                    addDoc(playersColl, data);
                    playState = "joined";
                    }
            }
        });
    }

    //subscribe to players collection to display all players
    let allPlayers = [];
    onSnapshot(playersColl, async (snapshot) => {
        snapshot.docs.forEach((doc) => {
            allPlayers.push({ ...doc.data()})
        })
    })
</script>


{#if !playState}
    <h1>Play!</h1>
    <button on:click={joinGame}>Join Game</button>
{:else if playState == "joined"}
    <h2>Waiting Room</h2>
    <p>You joined the game</p>
    <h4>Players:</h4>
    {#each allPlayers as player}
        <p>{player.uid}</p>
    {/each}
{/if}