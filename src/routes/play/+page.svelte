<script>
    import "$lib/style.css";
    import authStore from "../../stores/authStore";
    import { app } from "../initializeFirebase";
    import { getFirestore, addDoc, collection, onSnapshot, getDocs, where, query, updateDoc, doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
    import { rolesByPlayers, cardsByPlayers } from "$lib/dataByPlayers";
    import { customAlphabet } from 'nanoid';

    let playState = null, gameData, allPlayers = [], turnedCards, round, numberOfPlayers, realNumberOfPlayers, user;
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
    let cards = [];
    
    $: user = $authStore;
    $: console.log(user.name)
    $: if (user) {
        setUser();
    }


    const db = getFirestore(app);
    const playersColl = collection(db, "players")
    const gamesColl = collection(db, "games")
    let gameRef;

    async function setGameId() {
        const nanoid = customAlphabet('123456789', 6)

        let tempGameId = nanoid();
        let gameRef = await getDoc(doc(db, "games", tempGameId.toString()));
        
        // check if game id is already taken
        if (typeof gameRef.data() == "undefined") {
            console.log(tempGameId)
            return tempGameId;
        }
        else {
            setGameId();
        }
    }

    async function createGame() {
        // create game document
        let gameData = {
            gameState: "created",
        }

        let gameId = await setGameId();
        setDoc(doc(db, "games", gameId.toString()), gameData)

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

    async function setUser() {
        // setting user information
        userData.email = user.user.email;
        userData.uid = user.user.uid;
        userData.name = user.name;
        // check if user is already a player
        let alreadyPlayer;
        let playersWithSameId = await getDocs(query(playersColl, where("uid", "==", userData.uid)))
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

        let querySnapshot = await getDocs(collection(db, "players"));

        playerUpdated(querySnapshot);

    }
    
    function joinGameEnter(event) {
        if (event.key === "Enter") {
            joinGame(event);
        }
    }
    
    // start Game with enter
    document.addEventListener("keydown", (event) => {
        if (event.keyCode === 13 && playState == "joined") {
            startGame();
        }
    });

    async function joinGame(event, gameId=false) {
        round = 1;
        // set id to input id (if  not set from createGame)
        if (!gameId) {
            gameId = document.getElementById("gameIdInput").value;
        }
        gameId = parseInt(gameId);

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

    function setByPlayers(numberOfPlayers) {
        roles = Array(rolesByPlayers[numberOfPlayers.toString()].hacker).fill("Hacker").concat(Array(rolesByPlayers[numberOfPlayers.toString()].agent).fill("Agent"));

        let firewall = [], target = [], honeypot = [];
        firewall = Array(cardsByPlayers[numberOfPlayers.toString()].firewall).fill("firewall")
        target = Array(cardsByPlayers[numberOfPlayers.toString()].target).fill("target")
        honeypot = Array(cardsByPlayers[numberOfPlayers.toString()].honeypot).fill("honeypot")
        cards = firewall.concat(target).concat(honeypot);
    }

    async function startGame() {
        realNumberOfPlayers = 0;
        allPlayers.forEach((player) => {
            if (player.gameId === userData.game.id) {
                realNumberOfPlayers++;
            }
        })
        
        // distribute roles
        console.log("NOP: " + realNumberOfPlayers)
        setByPlayers(realNumberOfPlayers);

        allPlayers.forEach(async player => {
            if (player.gameId === userData.game.id) {
                let playerRole = distributeRoles();
                let playerCards = distributeCards(5);
                
                // add role & cards to db
                await updateDoc(doc(db, "players", player.id), {
                    role: playerRole,
                    cards: playerCards,
                });
            }
        });

        // set gameState in db to playing
        await setDoc(gameRef, {
            gameState: "playing",
            round: 1,
            startCards: {
                firewall: cardsByPlayers[realNumberOfPlayers.toString()].firewall,
                target: cardsByPlayers[realNumberOfPlayers.toString()].target,
                honeypot: cardsByPlayers[realNumberOfPlayers.toString()].honeypot,
            },
            cards: {
                firewall: cardsByPlayers[realNumberOfPlayers.toString()].firewall,
                target: cardsByPlayers[realNumberOfPlayers.toString()].target,
                honeypot: cardsByPlayers[realNumberOfPlayers.toString()].honeypot,
            },
            currentPlayer: userData.uid,
        })

        playState = "playing";
    }

    function distributeCards(numberOfCards) {
        let playerCards = [];

        // distribute random cards
        for (var i = 0; i < numberOfCards; i++) { // foreach card
            let index = Math.floor(Math.random()*cards.length);
            playerCards.push({
                value: cards[index], // card value (= the key in cards array)
                turned: false,
            });
            cards.splice(index, 1); // remove from list
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
        let gameDb = await getDoc(gameRef);
        gameDb = gameDb.data();

        let tempUser = await getDoc(docRef);

        gameDb.cards[cardType] -= 1
        updateDoc(gameRef, {
            cards: gameDb.cards,
            currentPlayer: tempUser.data().uid,
        })

        if (turnedCards == realNumberOfPlayers) {
            alert("Round ended");
            startNewRound()
        }
    }

    async function deleteGamePlayer() {
        await deleteDoc(doc(db, "players", userData.playeruid.toString()));
        await deleteDoc(doc(db, "games", userData.game.id.toString()));
        window.location.reload();
    }

    async function startNewRound() {
        if (userData.game.id) {
            let gameDb = await getDoc(doc(db, "games", userData.game.id.toString()));
            let dbCards = gameDb.data().cards;
            round = gameDb.data().round + 1;
            if (round < 5) {
                cards = Array(dbCards.firewall).fill("firewall").concat(Array(dbCards.honeypot).fill("honeypot").concat(Array(dbCards.target).fill("target")))
                console.log("New Round:" + round);
    
                allPlayers.forEach(async player => {
                    console.log(player.gameId + " , " + userData.game.id)
                    if (player.gameId === userData.game.id) {
                        let playerCards = distributeCards(6 - round);
                        // add new cards to db
                        await updateDoc(doc(db, "players", player.id), {
                            cards: playerCards,
                        });
                    }
                })
    
                await updateDoc(doc(db, "games", userData.game.id.toString()), {
                    round: round,
                })
            }
            else {
                console.log("Game ended")
                gameOver("Agent");
            }
        }
    }

    //subscribe to players collection to get all players
    let unsubscribePlayers = onSnapshot(playersColl, async (snapshot) => {
        playerUpdated(snapshot);
    })

    function playerUpdated(snapshot) {
        realNumberOfPlayers = 0;
        allPlayers = []; // clear player list
        turnedCards = 0;
        snapshot.docs.forEach((player) => { 
            console.log(userData.game.id)
            let cardsAmount = {"firewall": 0, "honeypot": 0, "target": 0}
            console.log( player.data().gameId + " : " + userData.game.id)
            if (player.data().cards && player.data().gameId === userData.game.id) {
                player.data().cards.forEach(card => {
                    cardsAmount[card.value] += 1;
                })
                realNumberOfPlayers++;
                console.log("increase players")
            }
            allPlayers.push({ ...player.data(), id: player.id, cardsAmount})
            if (player.data().cards) {
                let allCards = player.data().cards;
                allCards.forEach(card => {
                    if (card.turned) {
                        turnedCards += 1;
                    }
                });
            }
        })
        console.log("Number: " + realNumberOfPlayers)
    }

    // change game state if game is started (even by other players)
    $: if (gameData) {
        if (gameData.gameState == "playing") {
            playState = "playing";
        }
        if (gameData.cards){
            if (gameData.cards.honeypot == 0) {
                playState = "over";
                gameOver("Agent");
            }
            else if (gameData.cards.target == 0) {
                playState = "over"
                gameOver("Hacker");
            }
        }
    }

    async function gameOver(winner) {
        let win;
        allPlayers.forEach((player) => {
            if (player.id == userData.playeruid) {
                console.log(winner + " " + player.role)
                if (winner === player.role) {
                    win = true;
                }
                else {
                    win = false;
                }
            }
        })
        
        await updateDoc(doc(db, "players", userData.playeruid.toString()), {
            win
        });

        alert(winner + " won!")
    }

    function newGame() {
        let nextConfirmation = confirm("Are you sure you want to start a new game? Your current game will be deleted!");
        if (nextConfirmation) {
            startGame();
            joinGame();
        }
        else {
            return;
        }
    }

</script>
{#if !playState}

    <h1>Play!</h1>
    <h3>Join a Game</h3>
    <input type="text" name="gameId" id="gameIdInput" placeholder="Game ID" on:keydown={joinGameEnter}>
    <button on:click={joinGame}>Join Game</button>
    <br>
    <br>
    <h3>Create a new Game</h3>
    <button on:click={createGame}>Create Game</button>

{:else if playState == "joined"}
<div class="waiting">
    <h1>Waiting Room</h1>
    <p>Join the game at <a href="https://cyber-crusade.vercel.app">cyber-crusade.vercel.app</a> with the game ID:</p>
    <h2><span>{userData.game.id}</span></h2>
    <h4>Players:</h4>
    {#each allPlayers as player}
        {#if player.gameId === userData.game.id}
            <p>{player.name}</p>
        {/if}
    {/each}
    <button on:click={startGame}>Start Game</button>
</div>

{:else if playState == "playing" || playState == "over"}
<div class="playing">
    <div class="sidenav">
        <p>Round: {gameData.round}/4</p>
        <hr>
        <p>Target: {gameData.startCards.target - gameData.cards.target}/{gameData.startCards.target}</p>
        <p>Honeypot: {gameData.startCards.honeypot - gameData.cards.honeypot}/{gameData.startCards.honeypot}</p>
        <p>Firewall: {gameData.startCards.firewall - gameData.cards.firewall}/{gameData.startCards.firewall}</p>
        <hr>
            <p>Hacker: {rolesByPlayers[realNumberOfPlayers.toString()].hacker}</p>
            <p>Agent: {rolesByPlayers[realNumberOfPlayers.toString()].agent}</p>
        <hr>
        <button on:click={newGame}>Start New Game</button>
    </div>
    <div class="players">
        {#each allPlayers as player}
            {#if player.gameId === userData.game.id}
            <div class="player {player.uid == userData.uid ? 'thisPlayer' : ''} {gameData.currentPlayer == player.uid ? 'activePlayer' : ''}">
                <div class="player-info">
                    <h3>
                        {player.name}

                        {#if player.uid == userData.uid || playState == "over"}
                            (<i title="{player.role == "Agent" ? 'Agents try to direct hackers to honeypots.' : 'Hackers try to find targets.'}">{player.role}</i>)
                        {/if}
                    </h3>
                    {#if player.uid == userData.uid}
                        Firewall: {player.cardsAmount.firewall} <br>
                        Honeypot: {player.cardsAmount.honeypot} <br>
                        Target: {player.cardsAmount.target}
                    {/if}
                </div>
                <div class="cards">
                    {#each player.cards as card, i}
                        <img
                            class="{gameData.currentPlayer == userData.uid && player.uid != userData.uid && card.turned != true ? 'clickable' : ''} card"
                            playerid={player.id}
                            cardindex={i}
                            on:click={gameData.currentPlayer == userData.uid && player.uid != userData.uid && card.turned != true ? flipCard : ''}
                            src="/computers/{card.turned == true ? card.value : 'flipped'}.svg"
                        >
                    {/each}
                </div>
            </div>
            {/if}
        {/each}
    </div>
</div>
{/if}
<!-- class="{gameData.currentPlayer == userData.uid ? 'activePlayer' : ''} card" -->