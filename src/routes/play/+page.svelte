<script>
    import authStore from "../../stores/authStore";
    import { app } from "../initializeFirebase";
    import { getAuth } from "firebase/auth";
    import { getFirestore, addDoc, collection, onSnapshot, getDocs, where, query, updateDoc, doc, setDoc } from "firebase/firestore";
    
    let playState = null;
    const db = getFirestore(app);
    const playersColl = collection(db, "players")
    const gamesColl = collection(db, "games")
    // check if already in players collection and set playState
    
    function joinGame(event, gameId=false) {
        if (!gameId) {
            gameId = parseInt(document.getElementById("gameIdInput").value);
        }
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
                        gameId: gameId,
                    }
                    await addDoc(playersColl, data);
                }
                playState = "joined";
            }
        });
    }

    async function startGame() {
        // linking players to game (TK)

        // distribute roles
        let roles = ["Entdecker", "Entdecker", "Wächter"];
        allPlayers.forEach(async player => {
            // distribute roles
            let index = Math.floor(Math.random()*roles.length);
            let playerRole = roles[index];
            roles.splice(index, 1);
            console.log(playerRole)

            // add role to db
            await updateDoc(doc(db, "players", player.id), {
                role: playerRole,
            });


            console.log(player.uid)


        })

        playState = "playing";
    }

    //subscribe to players collection to display all players
    let allPlayers = [];
    $: onSnapshot(playersColl, async (snapshot) => {
        if (playState != "playing") {
            allPlayers = []; // clear player list
            snapshot.docs.forEach((doc) => {
                allPlayers.push({ ...doc.data(), id: doc.id })
            })
        }
    })

    // let game, gameId = "Gi5ShhYSfznHv8QRpuYy";
    // $: onSnapshot(doc(db, "games", gameId), async (snapshot) => {
    //     if (playState) {
    //         game = snapshot;
    //     }
    // })

    function createGame() {
        // create game document
        let gameData = {
            gameState: "created",
        }
        let gameId = "1";
        setDoc(doc(db, "games", gameId), gameData)

        joinGame(null, gameId)
    }
</script>


{#if !playState}
    <h1>Play!</h1>
    <input type="text" name="gameId" id="gameIdInput">
    <button on:click={joinGame}>Join Game</button>
    <br>
    <button on:click={createGame}>Create Game</button>
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