<script>
  export let scores;
  export let you;
</script>

<main class="px-3">
  <div id="scores">
    <ul class="list-group">
      {#each Object.entries(scores).sort((a,b) => b[1]-a[1]) as [key, value]}
        {#if key === you}
          <li class="list-group-item active">🎮 You : 🌟 {value}</li>
        {:else}
          <li class="list-group-item">🎮 {key} : 🌟 {value}</li>
        {/if}
        {:else}
      <li>No players?</li>
      {/each}
    </ul>
  </div>
</main>

