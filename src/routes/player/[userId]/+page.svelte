<script>
    import { authUser } from "$lib/stores/authStore";
</script>

<p class="name">{$authUser.name} <a href="/logout">Logout</a></p>
