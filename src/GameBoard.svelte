<script lang="ts">
  import { Phase } from 'src/model/game';

  import { Box, Game } from './model/game';
  import Countdown from './Countdown.svelte';
  import BoxContentSelector from './BoxContentSelector.svelte';
  import { Player } from './model/player';
  import ScoreList from './ScoreList.svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let game: Game;
  export let userId: string;
  export let players: Player[];
  let done;

  let incompleteContentSelection: boolean = true;
  let isSelectingContent: boolean = true;

  let contentPool = [];
  let contentSelection = [];
  let labelPool = [];
  let labelSelection = [];
  let guessSelection = [];
  let guessPool = [];
  let guessGroup = [];

  $: {
    console.log('input changes');
    contentPool = [...game.round.contentPool].map((x) => ({id: x, name: x}));
    contentSelection = [...Array(3)
      .map(() => undefined)];

    labelPool = [...game.round.labelPool].map((x) => ({id: x, name: x}));
    labelSelection = [...Array(9)
      .map(() => undefined)];

    guessSelection = [...Array(3)];
    guessPool = [...game.round.contentPool].map((x) => ({id: x, name: x}));
    guessGroup = game.round.boxes.map((b) => b.labels.join(''));
  }

  function updateContentSelection() {
    incompleteContentSelection = contentSelection.some((s) => s === undefined);
  }

  function saveContents() {
    isSelectingContent = false;
  }

  function sendSelection() {
    const labels = labelSelection.map((x) => x?.name ?? '');
    const content = contentSelection.map((x) => x?.name ?? '');
    const payload: Box[] = [
      {
        content: content[0],
        labels: [labels[0], labels[1], labels[2]],
      },
      {
        content: content[1],
        labels: [labels[3], labels[4], labels[5]],
      },
      {
        content: content[2],
        labels: [labels[6], labels[7], labels[8]],
      },
    ];
    console.log('boxes selected', payload);
    dispatch('boxesSelected', payload);
  }

  function guessContents() {
    const guesses = guessSelection.map((x) => x?.name ?? '');

    console.log('boxes guessed', guesses);
    dispatch('boxesGuessed', guesses);
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
                <Countdown countdown={60} on:completed="{() => done = true}"/>
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
                                        groups="{contentSelection.map((c) => c.name)}"
                                        groupSize="{3}"/>

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
                <Countdown countdown={60} on:completed="{() => done = true}"/>

                <BoxContentSelector groups="{guessGroup}"
                                    selection="{guessSelection}"
                                    pool="{guessPool}"
                                    groupSize="{1}"/>

                <button class="btn btn-lg btn-primary fw-bold"
                        on:click="{guessContents}">
                    Guess
                </button>
            {:else}
                <h2>Waiting for players to finish guessing your boxes! ✨</h2>
            {/if}
        {:else if game.phase === Phase.Scoring}
            <h1>💯 Current Scores</h1>
            <ScoreList players={players} scores={game.scores} you={userId}/>

            <br>

            {#if game.current.id === userId}
                <h4>It's your turn next! 👇 </h4>
                <h4>Time for some payback 💰↩️</h4>
                <button class="btn btn-lg btn-primary fw-bold" type="submit" on:click="{() => dispatch('continueNextRound')}">
                    Next Round
                </button>
            {:else}
                <h4>It's <span class="username">{game.current.name}</span> turn next! 👇 </h4>
            {/if}
        {/if}
    </div>
</main>
