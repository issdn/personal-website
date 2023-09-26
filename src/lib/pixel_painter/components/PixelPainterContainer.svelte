<script lang="ts">
    import PixelPainter from "./PixelPainter.svelte";
    import PixelPainterToolBox from "./PixelPainterToolBox.svelte";

    export let cells: string
    let painterInitialized = false;
</script>

<svelte:component bind:painterInitialized={painterInitialized} {cells} this={PixelPainter} />
{#if painterInitialized}
    <svelte:component this={PixelPainterToolBox} />
{/if}