<script>
  export let players;
  export let lobbyId;
</script>

<main class="px-3">
  <div id="pre-lobby">
    <h1>Joined lobby {lobbyId}</h1>
    <h4>Players:</h4>
    <ul class="list-group">
      {#each players as player}
      <li class="list-group-item">🎮 {player.name}</li>
      {:else}
      <li>No players?</li>
      {/each}
    </ul>
  </div>
</main>

