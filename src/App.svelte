<div class="d-flex h-100 text-center text-white bg-dark">
    <div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
        <header class="mb-auto">
            <div>
                <h3 class="float-md-start mb-0">📦 What's in the Box?</h3>
                <nav class="nav nav-masthead justify-content-center float-md-end">
                    <span class="nav-link" title={userId}>
                        {#if username}<span title={userId}>{username}</span>{/if}
                        {#if room}
                            {#if username === room.host.name} hosting lobby{:else} playing in lobby{/if} <b
                                class="text-white">{room.id}</b>
                        {/if}
                    </span>
                </nav>
            </div>
        </header>

        {#if game}
            <h1>Game</h1>

            <GameBoard game={game} userId={userId}/>
        {:else}
            {#if username && room}
                <div id="chat-container">
                    <PlayerList players={room.players} lobbyId={room.id}/>
                    {#if username === room.host.name}
                        <h1>You are host</h1>
                        <button on:click={hostStartGame} class="btn btn-primary">Start Game</button>
                    {/if}

                </div>
            {:else}
                <LoginForm on:click={join}/>
            {/if}
        {/if}


        <footer class="mt-auto text-white-50">
            <p>Created by SwagSlash Studios.</p>
        </footer>
    </div>
</div>

<style lang="scss">


  /*
 * Globals
 */


  /* Custom default button */
  .btn-secondary,
  .btn-secondary:hover,
  .btn-secondary:focus {
    color: #333;
    text-shadow: none; /* Prevent inheritance from `body` */
  }


  /*
   * Header
   */

  .nav-masthead .nav-link {
    padding: .25rem 0;
    font-weight: 700;
    color: rgba(255, 255, 255, .5);
    background-color: transparent;
    /*border-bottom: .25rem solid transparent;*/
  }

  .nav-masthead .nav-link:hover,
  .nav-masthead .nav-link:focus {
    border-bottom-color: rgba(255, 255, 255, .25);
  }

  .nav-masthead .nav-link + .nav-link {
    margin-left: 1rem;
  }

  .nav-masthead .active {
    color: #fff;
    border-bottom-color: #fff;
  }


  .bd-placeholder-img {
    font-size: 1.125rem;
    text-anchor: middle;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
  }

  @media (min-width: 768px) {
    .bd-placeholder-img-lg {
      font-size: 3.5rem;
    }
  }
</style>

<script lang="ts">

    import io from "socket.io-client";

    import PlayerList from './PlayerList.svelte';
    import LoginForm from './LoginForm.svelte';
    import GameBoard from "./GameBoard.svelte";

    import {Game} from './model/game';
    import {Room} from './model/room';

    let game: Game;
    let userId: string;
    let username: string;
    let room: Room;

    const socket = io('http://localhost:3000');

    socket.on('connect', () => {
        console.log('Successfully connected!');
        userId = socket.id
    });

    function join() {
        // god forgive me
        username = document.getElementById('usernameField')["value"]
        let lobby = document.getElementById('lobbyField')["value"]

        if (lobby === undefined || lobby === '') {
            console.log("Creating room :" + username)
            socket.emit('createRoom', username);
        } else {
            console.log("Joining room :" + lobby)
            socket.emit('joinRoom', username, lobby);
        }
    }

    function hostStartGame() {
        // start the game here
        socket.emit('startGame');
    }

    socket.on('roomClosed', () => {
        // TODO cancel everything
        room = undefined;
        console.log('room closed');
    });

    socket.on('roomCreated', (_room) => {
        room = _room
        console.log('room created', room.id, room.players.map((p) => p.name));
    });

    socket.on('roomJoined', (_room) => {
        room = _room
        console.log('Room joined', 'Host:', room.host.name, room.host.id);
    });

    socket.on('updatePlayers', (_room) => {
        room = _room
        const players = room.players;
        console.log('Players in room', room.id, players.map((p) => p.name));
    });

    socket.on('gameStarted', (_game) => {
        game = _game
        console.log('Host started game');
        console.log(JSON.stringify(_game))
    });
</script>
