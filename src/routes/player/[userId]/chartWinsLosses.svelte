<script>
    import {wins, losses} from  "./+page.svelte";
    import { chart } from "svelte-apexcharts";

    let options;

    $: options = {
        series: [wins , losses],
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