<script lang="ts">
  import { Player } from './model/player';

  export let scores: Record<string, number> = {};
  export let you: string = ''; // user id
  export let players: Player[] = [];

  let scoreList: [string, string, number][];

  $: {
    scoreList = players.map((p) => [p.id, p.name, scores[p.id] ?? 0])
    .sort(([,,score1], [,,score2]) => score2 - score1);
  }
</script>

<main class="px-3">
  <div id="scores">
    <ul class="list-group">
      {#each scoreList as [id, name, score]}
        {#if id === you}
          <li class="list-group-item active">🎮 {name} (You) : 🌟 {score}</li>
        {:else}
          <li class="list-group-item">🎮 {name} : 🌟 {score}</li>
        {/if}
        {:else}
      <li>No players?</li>
      {/each}
    </ul>
  </div>
</main>

