<script context="module">
    import ChartWinsLosses  from "./chartWinsLosses.svelte";
    import { page } from '$app/stores';

    import authStore from "../../../stores/authStore";
    import { app } from "../../initializeFirebase";
    import { getFirestore, collection, getDocs, where, query, doc, getDoc } from "firebase/firestore";

    export let wins=0, losses=0;

    const db = getFirestore(app);
    const playersColl = collection(db, "players")
    
    getData();

    async function getData() {
        let players = await getDocs(query(playersColl, where("uid", "==", "1URfvG2X1zTayhyeRqdC2JUBDJu2")));
        players.forEach((player) => {
            if (player.data().win == true) {
                wins++;
            }
            else if (player.data().win == false) {
                losses++;
            }
        })
    }

</script>
{$page.params.slug}
<div class="userInfo">
    <p class="name">{name}</p>
    <p class="level">Grandmaster</p>
    <div class="winstat">
        win/lose chart
        <ChartWinsLosses />
    </div>
</div>
<div class="stats">
    <div class="role">
        role chart
    </div>
    <div class="win">
        win chart
    </div>
    <div class="lose">
        lose chart
    </div>
</div>

