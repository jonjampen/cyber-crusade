<script>
    import authStore from "../../stores/authStore";
    import { app } from "../initializeFirebase";
    import { getFirestore, addDoc, collection, onSnapshot, getDocs, where, query, updateDoc, doc, setDoc } from "firebase/firestore";
    
    let playState = null, gameData, allPlayers = [];
    let roles = [];
    let cards = {"empty": 0, "gold": 0, "fire": 0};

    const db = getFirestore(app);
    const playersColl = collection(db, "players")
    const gamesColl = collection(db, "games")
    let gameRef;


    function createGame() {
        // create game document
        let gameData = {
            gameState: "created",
        }
        let gameId = "2";
        setDoc(doc(db, "games", gameId), gameData)

        joinGame(null, gameId)
    }

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
                let playersWithSameId = await getDocs(query(playersColl, where("uid", "==", user.uid)))
                playersWithSameId.forEach(doc => {
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

                // set game reference
                gameRef = doc(db, "games", "2");
                // subscribe to changes in the games collection
                let unsubscribeGame = onSnapshot(gamesColl, async (snapshot) => {
                    snapshot.docs.forEach((doc) => {
                        // safe game data if it is current game
                        if (doc.id == "2") {
                            gameData = doc.data();
                            console.log(gameData)
                        }
                    })
                })

                playState = "joined";
            }
        });
    }

    function setByPlayers() {
        roles.push("Entdecker", "Entdecker", "Wächter");
        cards["empty"] = 8;
        cards["gold"] = 5;
        cards["fire"] = 2;
    }

    async function startGame() {
        // distribute roles
        setByPlayers();
        allPlayers.forEach(async player => {
            let playerRole = distributeRoles();
            let playerCards = distributeCards();
            
            // add role & cards to db
            await updateDoc(doc(db, "players", player.id), {
                role: playerRole,
                cards: playerCards,
            });
        });

        // set gameState in db to playing
        await setDoc(gameRef, {
            gameState: "playing",
        })

        playState = "playing";
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

            // remove if none of type is left
            if (cards[Object.keys(cards)[cardIndex]] == 0) {
                delete cards[Object.keys(cards)[cardIndex]];
            }
        }

        return playerCards;
    }

    function distributeRoles() {
        // distribute random roles
        let index = Math.floor(Math.random()*roles.length);
        let playerRole = roles[index];
        roles.splice(index, 1); // remove from list
        
        return playerRole;
    }

    //subscribe to players collection to get all players
    let unsubscribePlayers = onSnapshot(playersColl, async (snapshot) => {
        allPlayers = []; // clear player list
        snapshot.docs.forEach((doc) => {
            allPlayers.push({ ...doc.data(), id: doc.id })
        })
    })

    // change game state if game is started (even by other players)
    $: if (gameData) {
        console.log(gameData.gameState)
        if (gameData.gameState == "playing") {
            playState = "playing";
        }
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