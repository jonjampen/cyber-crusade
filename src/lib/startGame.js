import { customAlphabet } from 'nanoid';
import { addDoc, collection, onSnapshot, getDocs, where, query, updateDoc, doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { firebaseDb } from "$lib/firebase.js";
import { gameStore } from '$lib/gameStore';
import { authUser } from './authStore';
import { goto } from '$app/navigation';

const playersColl = collection(firebaseDb, "players")

let user;
authUser.subscribe(val => user = val)

let game;
gameStore.subscribe(val => game = val)

async function setGameId() {
    const nanoid = customAlphabet("123456789", 6);
    let tempGameId = nanoid();

    // check if game id is already taken
    let gameRef = await getDoc(doc(firebaseDb, "games", tempGameId.toString()));
    if (typeof gameRef.data() == "undefined") {
        return tempGameId;
    } else {
        setGameId();
    }
}

export async function createGame() {
    // create game document
    let gameData = {
        gameState: "created",
    };

    let gameId = await setGameId();
    console.log(gameId);
    setDoc(doc(firebaseDb, "games", gameId.toString()), gameData);

    joinGame(gameId);
    return;
}

export async function joinGame(gameId) {
    gameId = parseInt(gameId);

    if (user.uid) {
        // cancel if already a player
        if (game.id != "") {
            alert("already in one game")
            return
        }

        let data = {
            uid: user.uid,
            name: user.name,
            gameId: gameId,
        };
        await addDoc(playersColl, data);

        // set game reference
        console.log("hey")
        gameStore.set({
            id: gameId,
            round: 0,
            state: "",
        })
        window.location.href = `/play/${game.id.toString()}`
    }
}

export async function startGame() {
    // start calc
    await updateDoc(doc(firebaseDb, "games", game.id), {
        gameState: "calculating"
    });

    numberOfPlayers = 0;
    return

    allPlayers.forEach((player) => {
        if (player.gameId === userData.game.id) {
            numberOfPlayers++;
        }
    })
    console.log("NOP: " + numberOfPlayers)

    // distribute roles
    setByPlayers(numberOfPlayers);

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
            firewall: cardsByPlayers[numberOfPlayers.toString()].firewall,
            target: cardsByPlayers[numberOfPlayers.toString()].target,
            honeypot: cardsByPlayers[numberOfPlayers.toString()].honeypot,
        },
        cards: {
            firewall: cardsByPlayers[numberOfPlayers.toString()].firewall,
            target: cardsByPlayers[numberOfPlayers.toString()].target,
            honeypot: cardsByPlayers[numberOfPlayers.toString()].honeypot,
        },
        currentPlayer: userData.uid,
    })

    playState = "playing";
}