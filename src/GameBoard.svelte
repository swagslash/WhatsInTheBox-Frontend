<script lang="ts">
  import { Phase } from 'src/model/game';

  import { Box, Game } from './model/game';
  import Countdown from './Countdown.svelte';
  import BoxContentSelector from './BoxContentSelector.svelte';
  import ScoreList from './ScoreList.svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let game: Game;
  export let userId: string;
  export let username: string;
  let done;
  let incompleteContentSelection: boolean = true;
  let isSelectingContent: boolean = true;

  console.log(game.round.contentPool);

  let contentPool = [...game.round.contentPool].map((x) => ({id: x, name: x}));
  let contentSelection = [...Array(3)
    .map(() => undefined)];

  let labelPool = [...game.round.labelPool].map((x) => ({id: x, name: x}));
  ;
  let labelSelection = [...Array(9)
    .map(() => undefined)];

  function updateContentSelection() {
    incompleteContentSelection = contentSelection.some((s) => s === undefined);
  }

  function saveContents() {
    isSelectingContent = false;
  }

  function sendSelection() {
    const payload: Box[] = [
      {
        content: contentSelection[0],
        labels: [{label: labelSelection[0], position: null}, {
          label: labelSelection[2],
          position: null,
        }, {label: labelSelection[2], position: null}],
      },
      {
        content: contentSelection[1],
        labels: [{label: labelSelection[3], position: null}, {
          label: labelSelection[4],
          position: null,
        }, {label: labelSelection[5], position: null}],
      },
      {
        content: contentSelection[2],
        labels: [{label: labelSelection[6], position: null}, {
          label: labelSelection[7],
          position: null,
        }, {label: labelSelection[8], position: null}],
      },
    ];
    console.log('boxes selected', payload);
    dispatch('boxesSelected', payload);
  }

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
                {#if isSelectingContent}
                    <BoxContentSelector on:selectionChange="{updateContentSelection}"
                                        selection={contentSelection}
                                        pool={contentPool}/>

                    <button class="btn btn-lg btn-primary fw-bold" disabled="{incompleteContentSelection}"
                            on:click="{saveContents}">
                        Assign Labels
                    </button>
                {:else }
                    <BoxContentSelector selection="{labelSelection}"
                                        pool="{labelPool}"
                                        groups="{contentSelection}"/>

                    <button class="btn btn-lg btn-primary fw-bold" on:click="{sendSelection}">
                        Finish
                    </button>
                {/if}
            {:else}
                <h2>Waiting for <span class="username">{game.current.name}</span> to finish decorating their boxes! ✨</h2>
            {/if}
        {:else if game.phase === Phase.Guessing}
            <h1>❓ Guessing phase</h1>
            {#if game.current.id !== userId}
                <h2>Can you guess what is in the box, based on the decorations of <span
                        class="username">{game.current.name}</span>?</h2>
                <Countdown countdown={30} on:completed="{() => done = true}"/>
            {:else}
                <h2>Waiting for players to finish guessing your boxes! ✨</h2>
            {/if}
        {:else if game.phase === Phase.Scoring}
            <h1>💯 Current Scores</h1>
            <ScoreList scores={game.scores} you={username}/>
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
