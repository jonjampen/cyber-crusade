<script>
    import { chart } from "svelte-apexcharts";
    import authStore from "../../../stores/authStore";
    import { app } from "../../initializeFirebase";
    import { getFirestore, collection, getDocs, where, query, doc, getDoc } from "firebase/firestore";

    let username, userId, wins=0, losses=0, options;

    // getting data
    authStore.subscribe(async ({ user, name }) => {
        if (user) {
            // setting user information
            userId = user.uid;
            username = name;
        }
    });

    const db = getFirestore(app);
    const playersColl = collection(db, "players")

    getData();

    async function getData() {
        let players = await getDocs(query(playersColl, where("uid", "==", userId)));
        players.forEach((player) => {
            if (player.data().win) {
                wins++;
            }
            else if (player.data().win == false) {
                losses++;
            }
        })
    }


    $: options = {
        series: [wins, losses],
        chart: {
          width: 200,
          type: 'pie',
          fontFamily: 'Roboto, sans-serif',
        },
        tooltip: {
            enabled: true,
            style: {
                fontSize: '12px',
                fontFamily: 'Roboto, sans-serif',
            },
        },
        stroke: {
          colors: ['none']
        },
        legend: {
          position: 'bottom',
          style: {
            colors: ['#fff'],
          }
        },
        labels: ['Wins', 'Losses'],
        dataLabels: {
            enabled: false,
        },

        colors:["#26C485", "#D7263D"],
    };
</script>

<div class="chart" use:chart={options}/>
