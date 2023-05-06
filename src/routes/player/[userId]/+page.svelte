<script>
    import authStore from "../../../stores/authStore";

    $: user = $authStore;
    $: console.log(user.name)

</script>

<p class="name">{user.name} <a href="/logout">Logout</a></p>
<!-- <div class="userInfo">
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
</div> -->