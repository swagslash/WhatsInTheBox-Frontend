<script lang="ts">
    import {Game} from "./model/game";
    import Countdown from "./Countdown.svelte";

    export let game: Game;
    export let userId: string;
</script>

<main class="px-3">
    <div id="game">
        <h1>Active Game</h1>
        <h2>Currently selecting: {game.current.name}</h2>
        <h3>My id: {userId}</h3>

        {#if game.current.id === userId}
            <h1>Your turn to pack!</h1>
            <Countdown countdown={20} on:completed="{() => done = true}"/>
        {/if}
    </div>
</main>
