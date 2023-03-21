<script>
    import authStore from "../../stores/authStore";
    import { app } from "../initializeFirebase";
    import { getAuth } from "firebase/auth";
    import { getFirestore, addDoc, collection, onSnapshot, getDocs, where, query } from "firebase/firestore";
    
    let playState = null;
    const db = getFirestore(app);
    const playersColl = collection(db, "players")
    const gamesColl = collection(db, "games")
    // check if already in players collection and set playState
    
    function joinGame() {
        authStore.subscribe(async ({ user, name }) => {
            if (user) {
                let alreadyPlayer;
                
                let playersWithId = await getDocs(query(playersColl, where("uid", "==", user.uid)))
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

    async function startGame() {
        // create game document
        let gameData = {
            gameState: "created",
        }
        addDoc(gamesColl, gameData)
        // linking players to game (TK)

        // distribute roles
        let roles = ["Entdecker", "Entdecker", "Wächter"];
        allPlayers.forEach(player => {
            let index = Math.floor(Math.random()*roles.length);
            let playerRole = roles[index];
            roles.splice(index, 1);
            // console.log(Math.floor(Math.random()*roles.length))
            console.log(playerRole)
        })

        playState = "playing";
    }

    //subscribe to players collection to display all players
    let allPlayers = [];
    $: onSnapshot(playersColl, async (snapshot) => {
        if (playState != "playing") {
            allPlayers = []; // clear player list
            snapshot.docs.forEach((doc) => {
                allPlayers.push({ ...doc.data()})
            })
        }
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