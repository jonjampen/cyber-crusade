<script>
    import authStore from "../../stores/authStore";
    import { app } from "../initializeFirebase";
    import { getAuth } from "firebase/auth";
    import { getFirestore, addDoc, collection, onSnapshot, getDocs, where, query, updateDoc, doc, setDoc } from "firebase/firestore";
    
    let playState = null;
    const db = getFirestore(app);
    const playersColl = collection(db, "players")
    const gamesColl = collection(db, "games")
    // check if already in a game and set playState
    
    function joinGame(event, gameId=false) {
        // set id to input id (if  not set from createGame)
        if (!gameId) {
            gameId = parseInt(document.getElementById("gameIdInput").value);
        }
        
        //get user data
        authStore.subscribe(async ({ user, name }) => {
            if (user) {
                // check if user is already a player
                let alreadyPlayer;
                let playersWithId = await getDocs(query(playersColl, where("uid", "==", user.uid)))
                playersWithId.forEach(doc => {
                    alreadyPlayer = doc.data().uid
                })

                // if not, add to players
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
    let roles = ["Entdecker", "Entdecker", "Wächter"];
    let cards = {"empty": 8, "gold": 5, "fire": 2,}
    
    async function startGame() {
        // distribute roles
        allPlayers.forEach(async player => {
            // distribute random roles
            let index = Math.floor(Math.random()*roles.length);
            let playerRole = roles[index];
            roles.splice(index, 1); // remove from list
            let playerCards = distributeCards();
            console.log(playerCards);
            
            // add role to db
            await updateDoc(doc(db, "players", player.id), {
                role: playerRole,
                cards: playerCards,
            });
        });
        playState = "playing";
        unsubscribe();
    }

    //subscribe to players collection to get all players
    let allPlayers = [];
    let unsubscribe;
    unsubscribe = onSnapshot(playersColl, async (snapshot) => {
        if (playState != "playing") {
            allPlayers = []; // clear player list
            snapshot.docs.forEach((doc) => {
                allPlayers.push({ ...doc.data(), id: doc.id })
            })
        }
    })


    // let game;
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
        let gameId = "2";
        setDoc(doc(db, "games", gameId), gameData)

        joinGame(null, gameId)
    }


    function distributeCards() {
        let playerCards = [], cardIndex;
        
        // distribute random cards
        while (playerCards.length < 5) {
            cardIndex = Math.floor(Math.random()*Object.keys(cards).length); // random number: index of cards
            cards[Object.keys(cards)[cardIndex]] -= 1; // remove from array
            
            // add to playerCards
            playerCards.push({
                value: Object.keys(cards)[cardIndex], // card value (= the key in cards array)
                turned: false,
            });

            if (cards[Object.keys(cards)[cardIndex]] == 0) {
                delete cards[Object.keys(cards)[cardIndex]];
            }
        }

        return playerCards;
    }
</script>

<p>{playState}</p>
<button on:click={distributeCards}>distribute Cards</button>
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