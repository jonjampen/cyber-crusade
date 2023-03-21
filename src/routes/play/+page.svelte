<script>
    import authStore from "../../stores/authStore";
    import { app } from "../initializeFirebase";
    import { getAuth } from "firebase/auth";
    import { getFirestore, addDoc, collection, onSnapshot, getDocs, where } from "firebase/firestore";
    
    let playState = null;
    const db = getFirestore(app);
    const playersColl = collection(db, "players")
    const gamesColl = collection(db, "games")
    // check if already in players collection and set playState
    
    function joinGame() {
        authStore.subscribe(async ({ user, name }) => {
            if (user) {
                let alreadyPlayer;
                let playersWithId = await getDocs(playersColl, where("uid", "==", user.uid))
                playersWithId.forEach(doc => {
                    alreadyPlayer = doc.data().uid
                })
                if (!alreadyPlayer) {   
                    let data = {
                        uid: user.uid,
                        name: name,
                    }
                    addDoc(playersColl, data);
                }
                playState = "joined";
            }
        });
    }

    function startGame() {
        // create game document
        let gameData = {
            gameState: "created",
        }
        addDoc(gamesColl, gameData)
        // linking players to game

        // distribute roles

        playState = "playing";
    }

    //subscribe to players collection to display all players
    let allPlayers = [];
    $: onSnapshot(playersColl, async (snapshot) => {
        allPlayers = []; // clear player list
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
        <p>{player.name}</p>
    {/each}
    <button on:click={startGame}>Start Game</button>
{:else if playState == "playing"}
    <p>Playing</p>
{/if}