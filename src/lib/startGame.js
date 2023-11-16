import { customAlphabet } from 'nanoid';
import { addDoc, collection, onSnapshot, getDocs, where, query, updateDoc, doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { firebaseDb } from "$lib/firebase.js";
import { gameStore } from '$lib/stores/gameStore';
import { playersStore } from '$lib/stores/playersStore';
import { authUser } from '$lib/stores/authStore';
import { goto } from '$app/navigation';
import { rolesByPlayers } from '$lib/gameSetup/rolesByPlayers';
import { cardsByPlayers } from '$lib/gameSetup/cardsByPlayers';

const playersColl = collection(firebaseDb, "players")

let user;
authUser.subscribe(val => user = val);

let game;
gameStore.subscribe(val => game = val);

let players;
playersStore.subscribe(val => players = val);

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

export async function createGame(state = false) {
    // create game document
    let gameData = {
        gameState: "created",
    };

    let gameId = await setGameId();
    console.log(gameId);
    setDoc(doc(firebaseDb, "games", gameId.toString()), gameData);

    if (state === "continue") {
        console.log("co")
        return gameId;
    }
    joinGame(gameId);
    return;
}

export async function joinGame(gameId) {
    gameId = parseInt(gameId);

    if (user.uid) {
        // cancel if already a player
        // if (game.id != "") {
        //     alert("already in one game")
        //     return
        // }

        let data = {
            uid: user.uid,
            name: user.name,
            gameId: gameId,
        };
        await addDoc(playersColl, data);

        // set game reference
        gameStore.set({
            id: gameId,
        })
        window.location.href = `/play/${game.id.toString()}`
    }
}

export async function startGame() {
    // start calc

    let numberOfPlayers = players.length

    if (numberOfPlayers < 3) {
        alert('You must be at least 3 players to play.');
        return
    }

    await updateDoc(doc(firebaseDb, "games", game.id), {
        gameState: "calculating",
        round: 0,
        startCards: cardsByPlayers[numberOfPlayers.toString()],
        cards: cardsByPlayers[numberOfPlayers.toString()],
        startRoles: rolesByPlayers[numberOfPlayers.toString()],
        currentPlayer: players[0].uid,
    });

    await distribute(numberOfPlayers);
    await updateDoc(doc(firebaseDb, "games", game.id), {
        gameState: "playing",
        round: 1,
    });
    return
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

async function distribute(nop) {
    let roles = flatten(rolesByPlayers[nop.toString()]);
    roles = shuffle(roles);

    let cards = flatten(cardsByPlayers[nop.toString()]);
    cards = shuffle(cards);

    // distribute
    for (const player of players) {
        if (player.gameId.toString() === game.id) {
            let playerCards = [];

            for (let i = 0; i < 5; i++) {
                playerCards.push({
                    value: cards[0],
                    turned: false,
                });
                cards.shift();
            }

            await updateDoc(doc(firebaseDb, "players", player.id), {
                role: roles[0],
                cards: playerCards,
            });

            roles.shift();
        }
    }
}
