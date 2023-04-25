<script>
  import { chart } from "svelte-apexcharts";
  let options = {
    chart: {
      type: "bar",
    },
    series: [
      {
        name: "sales",
        data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
      },
    ],
    xaxis: {
      categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
    },
  };

</script>

<div class="userInfo">
    <p class="name">Jon</p>
    <p class="level">Grandmaster</p>
    <div class="winstat">
        win/lose chart
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

    <div class="chart" use:chart={options} stlye="color: black !important"/>
