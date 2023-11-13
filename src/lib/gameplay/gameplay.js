import { firebaseDb } from "$lib/firebase.js"
import { gameStore } from "$lib/stores/gameStore.ts"
import {
    getDoc,
    updateDoc,
    doc,
} from "firebase/firestore";

let game;
gameStore.subscribe(val => game = val);

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
        currentPlayer: nextActiveUser.data().uid,
    })

    // if (turnedCards == realNumberOfPlayers) {
    //     alert("Round ended");
    //     startNewRound()
    // }
}