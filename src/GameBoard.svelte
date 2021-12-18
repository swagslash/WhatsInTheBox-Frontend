<script lang="ts">
    import {Phase} from "src/model/game";

    import {Game} from "./model/game";
    import Countdown from "./Countdown.svelte";
    import BoxContentSelector from "./BoxContentSelector.svelte";
    import BoxStickerSimpleSelector from "./BoxStickerSimpleSelector.svelte";
    import ScoreList from "./ScoreList.svelte";

    export let game: Game;
    export let userId: string;
    export let username: string;
    let done;

</script>

<style>
    .username {
        font-style: italic;
    }
</style>

<main class="px-3">
    <div id="game">
        <p>Decorator for this round: {game.current.name}</p>

        {#if game.phase === Phase.Selection}
            <h1>👉 Selection phase</h1>
            {#if game.current.id === userId}
                <h2>Your turn to pack and decorate!</h2>
                <Countdown countdown={90} on:completed="{() => done = true}"/>
                <BoxContentSelector/>

                <BoxStickerSimpleSelector/>
            {:else}
                <h2>Waiting for <span class="username">{game.current.name}</span> to finish decorating their boxes! ✨</h2>
            {/if}
        {:else if game.phase === Phase.Guessing}
            <h1>❓ Guessing phase</h1>
            {#if game.current.id === userId}
                <h2>Can you guess what is in the box, based on the decorations of <span class="username">{game.current.name}</span>?</h2>
                <Countdown countdown={30} on:completed="{() => done = true}"/>
                <BoxContentSelector/>

                <BoxStickerSimpleSelector/>
            {/if}
        {:else if game.phase === Phase.Scoring}
            <h1>💯 Current Scores</h1>
            <ScoreList scores={game.scores} you={username} />
            {#if game.current.id === userId}
                <h4>It's your turn next! 👇 </h4>
                <p>Time for some payback 💰↩️</p>
                <button class="btn btn-lg btn-secondary fw-bold" type="submit" on:click>
                    Continue with next round
                </button>
            {:else}
                <h4>It's <span class="username">{game.current.name}</span> turn next! 👇 </h4>
            {/if}
        {/if}
    </div>
</main>
