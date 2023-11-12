<script>
    import {
        addDoc,
        collection,
        onSnapshot,
        getDocs,
        where,
        query,
        updateDoc,
        doc,
        setDoc,
        getDoc,
        deleteDoc,
    } from "firebase/firestore";
    import { firebaseDb } from "$lib/firebase.js";
    import { gameStore } from "$lib/gameStore";
    import { onMount } from "svelte";
    import { authUser } from "$lib/authStore";

    onMount(async () => {
        // get current game: get player + gameid by userid -> get game by id
        let user;
        let gameId = "";
        authUser.subscribe((val) => (user = val));

        let playersColl = collection(firebaseDb, "players");
        let users = await getDocs(
            query(playersColl, where("uid", "==", user.uid))
        );
        users.forEach((doc) => {
            gameId = doc.data().gameId;
        });

        // keep updating game
        let gameData;
        if (gameId) {
            let unsubscribeGame = onSnapshot(
                doc(firebaseDb, "games", gameId.toString()),
                (doc) => {
                    gameData = doc.data();
                    console.log(gameData);
                    console.log("Hey");
                    console.log($gameStore);
                    $gameStore = {
                        id: gameId.toString(),
                        round: 0,
                        state: gameData.gameState,
                    };
                    $gameStore.id = gameId.toString();
                    // $gameStore = {}
                }
            );
        }
    });
</script>

{$gameStore.id}

<slot />
