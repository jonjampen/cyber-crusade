<script>
    import "$lib/style.css";
    import authStore from "../../stores/authStore";
    import { app } from "../initializeFirebase";
    import { getFirestore, addDoc, collection, onSnapshot, getDocs, where, query, updateDoc, doc, setDoc, getDoc } from "firebase/firestore";
    
    let playState = null, gameData, allPlayers = [];
    let userData={
        "uid": null,
        "name": null,
        "email": null,
        "game": {
            "id": null,
            "cards": {},
        },
    };
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
        let gameId = "2"; //! Random!
        setDoc(doc(db, "games", gameId), gameData)

        joinGame(null, gameId)
    }

    function subscribeToGame(id) {
        // subscribe to changes in the games collection
        return onSnapshot(gamesColl, async (snapshot) => {
            snapshot.docs.forEach((doc) => {
                // safe game data if it is current game
                if (doc.id == id.toString()) {
                    gameData = doc.data();
                }
            });
        });
    }

    authStore.subscribe(async ({ user, name }) => {
        if (user) {
            // setting user information
            userData.email = user.email;
            userData.uid = user.uid;
            userData.name = name;

            // check if user is already a player
            let alreadyPlayer;
            let playersWithSameId = await getDocs(query(playersColl, where("uid", "==", user.uid)))
            playersWithSameId.forEach(doc => {
                alreadyPlayer = doc.data()
            })

            if (alreadyPlayer) {
                playState = "joined";
                //! Get players game id
                userData.game.id = alreadyPlayer.gameId;

                // set game reference
                gameRef = doc(db, "games", userData.game.id.toString());
                let unsubscribeGame = subscribeToGame(userData.game.id);
            }
        }
    });

    async function joinGame(event, gameId=false) {
        // set id to input id (if  not set from createGame)
        if (!gameId) {
            gameId = parseInt(document.getElementById("gameIdInput").value);
        }

        if (userData != {}) {
            // if not already a player, add to players
            if (userData.game.id == null) {
                userData.game.id = gameId;

                let data = {
                    uid: userData.uid,
                    name: userData.name,
                    gameId: userData.game.id,
                }
                await addDoc(playersColl, data);
            }

            // set game reference
            gameRef = doc(db, "games", userData.game.id.toString());
            let unsubscribeGame = subscribeToGame(userData.game.id);

            playState = "joined";
        }
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
    
    async function flipCard(e) {
        let playerId = e.srcElement.attributes.playerid.value;
        let cardIndex = e.srcElement.attributes.cardindex.value;
        let docRef = doc(db, "players", playerId);
        let newCards=[];

        try {
            newCards = await getDoc(docRef)
            newCards = newCards.data().cards
        } catch(error) {
            console.error(error)
            return;
        }

        newCards[cardIndex].turned = true;
        console.log(newCards);

        try {
            await updateDoc(docRef, {
                cards: newCards,
            });
        } catch(error) {
            console.error(error)
            return;
        }
        
        console.log(playerId + " : " + cardIndex)
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
console.log(allPlayers[0])
</script>

{#if !playState}

    <h1>Play!</h1>
    <h3>Join a Game</h3>
    <input type="text" name="gameId" id="gameIdInput" placeholder="Game ID">
    <button on:click={joinGame}>Join Game</button>
    <br>
    <br>
    <h3>Create a new Game</h3>
    <button on:click={createGame}>Create Game</button>

{:else if playState == "joined"}
<div class="waiting">
    <h1>Waiting Room</h1>
    <p>Join the game at <a href="https://cyber-crusade.vercel.app">www.cyber-crusade.vercel.app</a> with the game ID:</p>
    <h2><span>{userData.game.id}</span></h2>
    <h4>Players:</h4>
    {#each allPlayers as player}
    <p>{player.name}</p>
    {/each}
    <button on:click={startGame}>Start Game</button>
</div>

{:else if playState == "playing"}
<div class="playing">
    <div class="sidenav">
        <p>Round: 1/4</p>
        <hr>
        <p>Gold: 0/5</p>
        <p>Fire: 0/2</p>
        <p>Empty: 0/8</p>
        <hr>
        <p>Entdecker: 2</p>
        <p>Wächter: 1</p>
    </div>
    <div class="players">
        {#each allPlayers as player}
        <div class="player">
            <h3>{player.name}</h3>
            <div class="cards">
                {#each player.cards as card, i}
                <div class="card" playerid={player.id} cardindex={i} on:click={flipCard}>
                    {#if card.turned}
                        {card.value}
                    {/if}
                </div>
                {/each}
            </div>
        </div>
        {/each}
    </div>
</div>
{/if}