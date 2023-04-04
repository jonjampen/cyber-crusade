<script>
    import "$lib/style.css";
    import authStore from "../../stores/authStore";
    import { app } from "../initializeFirebase";
    import { getFirestore, addDoc, collection, onSnapshot, getDocs, where, query, updateDoc, doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
    
    let playState = null, gameData, allPlayers = [];
    let userData={
        "uid": null,
        "playeruid": null,
        "name": null,
        "email": null,
        "game": {
            "id": null,
            "cards": {},
            "round": 1,
        },
    };
    let roles = [];
    let cards = {"firewall": 0, "system": 0, "honeypot": 0};

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
                userData.playeruid = doc.id;
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
        roles.push("Hacker", "Hacker", "Agent");
        cards["firewall"] = 8;
        cards["system"] = 5;
        cards["honeypot"] = 2;
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
            round: 1,
            startCards: {
                firewall: 8,
                system: 5,
                honeypot: 2,
            },
            cards: {
                firewall: 8,
                system: 5,
                honeypot: 2,
            },
            currentPlayer: userData.uid,
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
        // update players cards
        try {
            await updateDoc(docRef, {
                cards: newCards,
            });
        } catch(error) {
            console.error(error)
            return;
        }
        
        // Update cards in game db
        let cardType = newCards[cardIndex].value;
        let gameRef = doc(db, "games", userData.game.id.toString())
        console.log(userData.game.id)
        let gameDb = await getDoc(gameRef);
        gameDb = gameDb.data();

        let user = await getDoc(docRef);

        gameDb.cards[cardType] -= 1
        updateDoc(gameRef, {
            cards: gameDb.cards,
            currentPlayer: user.data().uid,
        })
    }

    async function deleteGamePlayer() {
        await deleteDoc(doc(db, "players", userData.playeruid.toString()));
        await deleteDoc(doc(db, "games", userData.game.id.toString()));
        window.location.reload();
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
        if (gameData.cards){
            if (gameData.cards.honeypot == 0) {
                console.log("Agents won!")
            }
            else if (gameData.cards.system == 0) {
                console.log("Hackers won!")
            }
        }
    }
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
        <p>Round: {gameData.round}/4</p>
        <hr>
        <p>System: {gameData.startCards.system - gameData.cards.system}/{gameData.startCards.system}</p>
        <p>Honeypot: {gameData.startCards.honeypot - gameData.cards.honeypot}/{gameData.startCards.honeypot}</p>
        <p>Firewall: {gameData.startCards.firewall - gameData.cards.firewall}/{gameData.startCards.firewall}</p>
        <hr>
        <p>Hacker: 2</p>
        <p>Agent: 1</p>
    </div>
    <div class="players">
        {#each allPlayers as player}
        <div class="player">
            
                <h3>
                    {#if gameData.currentPlayer == player.uid}
                        *{player.name}*
                    {:else}
                        {player.name}
                    {/if}
                    {#if player.uid == userData.uid}
                        ({player.role})
                    {/if}
                </h3>
            <div class="cards">
                {#each player.cards as card, i}
                <div class="{gameData.currentPlayer == userData.uid && player.uid != userData.uid ? 'activePlayer' : ''} card" playerid={player.id} cardindex={i} on:click={gameData.currentPlayer == userData.uid && player.uid != userData.uid ? flipCard : ''}>
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
<button on:click={deleteGamePlayer}>Delete Game & Player</button>
{/if}

<!-- class="{gameData.currentPlayer == userData.uid ? 'activePlayer' : ''} card" -->