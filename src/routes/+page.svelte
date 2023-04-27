<script>
    import Instructions from '$lib/instructions.md';

</script>
<div class="content">
    <div class="instructions">
        <Instructions />
    </div>
</div>

<style>
    .instructions {
        width: 70%;
        background-color: var(--primary-light);
        padding: 8px 16px;
        border-radius: 16px;
    }
    .content {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
</style>