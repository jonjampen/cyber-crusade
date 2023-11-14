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
        alert("Round ended");
        startNewRound()
    }
    else {
        await updateDoc(gameRef, {
            gameState: "playing",
            currentPlayer: nextActiveUser.data().uid,
        })
    }
}