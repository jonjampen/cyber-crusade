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
        let unsubscribeGame = onSnapshot(
            doc(firebaseDb, "games", gameId.toString()),
            (doc) => {
                gameData = doc.data();
                console.log(gameData);
            }
        );

        $gameStore.id = gameId.toString();
    });

    // get game info
    // let game;
    // let gamesColl = collection(firebaseDb, "games");
    // let games = await getDoc(doc(gamesColl, gameId));
    // games.forEach((doc) => {
    //     game = doc.data();
    // });
    // console.log(game);

    // gameStore.set
</script>

{$gameStore.id}

<slot />
