import { customAlphabet } from 'nanoid';
import { addDoc, collection, onSnapshot, getDocs, where, query, updateDoc, doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { firebaseDb } from "$lib/firebase.js";
import { gameStore } from '$lib/gameStore';
import { authUser } from './authStore';
import { goto } from '$app/navigation';

const playersColl = collection(firebaseDb, "players")

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

    let user;
    authUser.subscribe(val => user = val)

    let game;
    gameStore.subscribe(val => game = val)

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
        console.log(game)
        gameStore.set({
            id: gameId,
            round: 0,
            state: "",
        })
        console.log(game)
        window.location.href = `/play/${game.id.toString()}`
    }
}