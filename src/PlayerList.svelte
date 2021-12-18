<style>
  .player-list {
    text-decoration: none;
    box-shadow: none;
    text-shadow: none;
    font-size: 17pt;
  }
</style>

<main class="px-3">
  <div id="pre-lobby">
    <h1>Joined lobby {room.id}</h1>
    <h2>Players:</h2>
    <ul class="list-group player-list">
      {#each players as player}
      <li class="list-group-item d-flex justify-content-between align-items-center">🎮 {player.name}
        {#if player.id === myUserId}
          (You)
        {/if}
        {#if player.id === room.host.id}
          <span class="badge bg-primary rounded-pill" style="font-weight: bold">Host</span>
        {/if}

      </li>
      {:else}
      <li>No players?</li>
      {/each}
    </ul>
  </div>
</main>

<script lang="ts">
  import {Room} from './model/room';

  export let players;
  export let myUserId;
  export let lobbyId;
  export let room: Room;
</script>
