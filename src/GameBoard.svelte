<script lang="ts">

    import {Game} from "./model/game";
    import Countdown from "./Countdown.svelte";
    import BoxContentSelector from "./BoxContentSelector.svelte";
    import BoxStickerSelector from "./BoxStickerSelector.svelte";
    import BoxStickerSimpleSelector from "./BoxStickerSimpleSelector.svelte";

    export let game: Game;
    export let userId: string;
    let done;

    // BELOW UNSAFE CODE
</script>

<main class="px-3">
    <div id="game">
        <h2>Currently selecting: {game.current.name}</h2>

        {#if game.current.id === userId}
            <h1>Your turn to pack!</h1>
            <Countdown countdown={20} on:completed="{() => done = true}"/>
            <BoxContentSelector/>

            <BoxStickerSimpleSelector/>
        {/if}
    </div>
</main>
