import { firebaseDb } from "$lib/firebase.js"
import { gameStore } from "$lib/stores/gameStore"
import { playersStore } from "$lib/stores/playersStore"
import {
    getDoc,
    updateDoc,
    doc,
} from "firebase/firestore";

let game;
gameStore.subscribe(val => game = val);

let players;
playersStore.subscribe(val => players = val);


export async function flipCard(e) {
    let playerId = e.srcElement.attributes.playerid.value;
    let cardIndex = e.srcElement.attributes.cardindex.value;
    let playerRef = doc(firebaseDb, "players", playerId);
    let newCards = [];

    let nextActiveUser = await getDoc(playerRef);
    newCards = nextActiveUser.data().cards
    newCards[cardIndex].turned = true;

    // update players cards
    await updateDoc(playerRef, {
        cards: newCards,
    });

    // Update cards in game db
    let cardType = newCards[cardIndex].value;
    let gameRef = doc(firebaseDb, "games", game.id.toString())

    let gameDb = await getDoc(gameRef);
    gameDb = gameDb.data();


    gameDb.cards[cardType] -= 1
    await updateDoc(gameRef, {
        cards: gameDb.cards,
        gameState: "clicked",
    })

    // check if round ended
    let turnedCards = 0;
    players.forEach(player => {
        player.cards.forEach(card => {
            if (card.turned) turnedCards++;
        })
    });
    if (turnedCards == players.length) {
        await updateDoc(gameRef, {
            gameState: "roundEnded",
        })
        alert("Round ended");
        await startNewRound(nextActiveUser.data().uid)
    }
    else {
        await updateDoc(gameRef, {
            gameState: "playing",
            currentPlayer: nextActiveUser.data().uid,
        })
    }
}

async function startNewRound(nextUserId) {
    let gameRef = doc(firebaseDb, "games", game.id.toString())
    distribute(game.cards, parseInt(game.round))

    await updateDoc(gameRef, {
        gameState: "playing",
        round: parseInt(game.round) + 1,
        currentPlayer: nextUserId,
    })
}

async function distribute(cards, round) {
    let newCards = flatten(cards);
    newCards = shuffle(newCards);

    // distribute
    await players.forEach(async (player) => {
        if (player.gameId.toString() === game.id) {
            let playerCards = [];

            for (let i = 0; i < (5 - round); i++) {
                playerCards.push({
                    value: newCards[0],
                    turned: false,
                })
                newCards.shift();
            }

            await updateDoc(doc(firebaseDb, "players", player.id), {
                cards: playerCards,
            });
        }
    })
}


function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}

function flatten(object) {
    let array = [];
    Object.entries(object).forEach(([key, count]) => {
        for (let i = 0; i < count; i++) {
            array.push(key);
        }
    });
    return array
}