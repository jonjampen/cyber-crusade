<script>
    import { authUser } from "$lib/authStore";
</script>

<p class="name">{$authUser.name} <a href="/logout">Logout</a></p>
