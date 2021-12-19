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
            <GameBoard on:boxesSelected={hostSelectBoxes}
                       on:boxesGuessed={playerGuessBox}
                       on:continueNextRound={hostStartGame}
                       game={game}
                       userId={userId}
                       players={room?.players ?? []}/>
        {:else}
            {#if username && room}
                <div id="chat-container">
                    <PlayerList room={room} players={room.players} lobbyId={room.id} myUserId={userId} />
                    <br>
                    {#if username === room.host.name}
                        <p>You are hosting this lobby.</p>
                        {#if room.players.length < 2}
                            <p>⏳ Wait for more players to start the game. ⏳</p>
                        {/if}
                        <button class="btn btn-lg btn-primary fw-bold" on:click={hostStartGame} disabled="{startGameDisabled}">👉 Start Game 👈</button>
                    {:else}
                        <p>⏳ Wait for your host to start the game. ⏳</p>
                    {/if}
                </div>
            {:else}
                {#if result}
                    <div id="results-container">
                        <ScoreList scores={result.scores} you={username}/>
                        <br/>
                        <button class="btn btn-lg btn-primary fw-bold" type="submit" on:click={backToMain}>
                            <!--{#if lobbyId}Enter{:else}Create{/if} Lobby-->
                            Back to Main
                        </button>
                        {#if result.current.name === username}
                            <button class="btn btn-lg btn-primary fw-bold" type="submit" on:click={nextRound}>
                                <!--{#if lobbyId}Enter{:else}Create{/if} Lobby-->
                                Next Round
                            </button>
                        {/if}
                    </div>
                {:else}
                <LoginForm on:click={join}/>
<!--                    <br/>-->
<!--                <button class="btn btn-lg btn-primary fw-bold" type="submit" on:click={showResults}>-->
<!--                    &lt;!&ndash;{#if lobbyId}Enter{:else}Create{/if} Lobby&ndash;&gt;-->
<!--                    Results Mock-->
<!--                </button>-->
                {/if}
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

    import { Game, Phase } from './model/game';
    import {Room} from './model/room';
    import {Player} from "src/model/player";
    import ScoreList from "./ScoreList.svelte";

    let game: Game;
    let userId: string;
    let username: string;
    let room: Room;
    let result: Game;

    let startGameDisabled: boolean = false;

    // const socket = io('http://164.90.213.85:3000/');
    const socket = io('http://localhost:3000');

    socket.on('connect', () => {
        console.log('Successfully connected!');
        userId = socket.id
    });

    socket.on('disconnected', function() {
        userId = undefined;
        game = undefined;
        room = undefined;
        console.log("Disconnected from server.")
    });

    function join() {
        // god forgive me
        username = document.getElementById('usernameField')["value"]
        let lobby = document.getElementById('lobbyField')["value"]

        if (lobby === undefined || lobby === '') {
            console.log("Room " + lobby + "created by " + username)
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

    function hostSelectBoxes(event) {
      console.log('host select boxes', event.detail);
      socket.emit('selectBoxes', event.detail);
    }

    function playerGuessBox(event) {
      console.log('player guessed', event.detail);
      socket.emit('guessBoxes', event.detail);
    }

    function updateRoom(_room) {
        room = _room
        startGameDisabled = room.players.length <= 1;
    }

    socket.on('roomClosed', () => {
        // TODO cancel everything
        room = undefined;
        console.log('room closed');
    });

    socket.on('roomCreated', (_room) => {
        updateRoom(_room);
        console.log('room created', room.id, room.players.map((p) => p.name));
    });

    socket.on('roomJoined', (_room) => {
        updateRoom(_room);
        console.log('Room joined', 'Host:', room.host.name, room.host.id);
    });

    socket.on('updatePlayers', (_room) => {
        updateRoom(_room);
        console.log('Players in room', room.id, room.players.map((p) => p.name));
    });

    socket.on('gameStarted', (_game) => {
        game = _game
        console.log('Host started game');
        console.log(JSON.stringify(_game))
    });

    socket.on('guessBoxes', (_game) => {
        game = _game;
        console.log('boxes to guess', game.round.boxes);
        console.log('guess Boxes was sent, selection time is over.');
    });

    socket.on('reportScores', (_game) => {
        game = _game;
        console.log('Game finished:', game.scores);
        console.log('next player', game.current.name, game.current.id);
        console.log('\n\n');
    });

    function backToMain() {
        game = undefined;
        userId = undefined;
        username = undefined;
        room = undefined;
        result = undefined;
    }

    function nextRound() {
        hostStartGame();
        console.log("Next Round Called");
    }
</script>
