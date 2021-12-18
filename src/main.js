import io from 'socket.io-client';

import App from './App.html';
const socket = io('http://localhost:3000');

const app = new App({
  target: document.getElementById('root'),
  data: {
    username: '',
    user: undefined,
    room: undefined
  }
});

socket.on('connect', () => {
  console.log('Successfully connected!');
});

app.on('start', () => {
  // start the game here
  socket.emit('startGame');
});

socket.on('roomClosed', () => {
  // TODO cancel everything
  app.set({
    room: undefined
  });
  console.log('room closed');
});

app.on('join', () => {
  app.set({
    username: document.getElementById('usernameField').value,
    lobby: document.getElementById('lobbyField').value
  });
  const { username, lobby } = app.get();
  if (lobby === undefined || lobby === '' ) {
    console.log("Creating room :" + username)
    socket.emit('createRoom', username);
  } else {
    console.log("Joining room :" + lobby)
    socket.emit('joinRoom', username, lobby);
  }
});

socket.on('roomCreated', (room) => {
  console.log('room created', room.id, room.players.map((p) => p.name));
  app.set({
    room: room,
  });
});

socket.on('roomJoined', (room) => {
  app.set({
    room: room,
  });
  console.log('Room joined', 'Host:', room.host.name, room.host.id);
});

socket.on('updatePlayers', (room) => {
  app.set({
    room: room,
  });
  const players = room.players;
  console.log('Players in room', room.id, players.map((p) => p.name));
});

socket.on('gameStarted', (game) => {
  app.set({
    game: game,
  });
  console.log('Host started game');
});

window.app = app;

export default app;
