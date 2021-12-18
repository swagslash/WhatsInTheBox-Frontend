import io from 'socket.io-client';

import App from './App.html';
const socket = io('http://localhost:3000');

const app = new App({
  target: document.getElementById('root'),
  data: {
    username: '',
    room: undefined
  }
});

socket.on('connect', () => {
  console.log('Successfully connected!');
});

app.on('submitForm', () => {
  const { newMessage, username } = app.get();
  console.log(username)
  socket.emit('newMessage', {
    text: newMessage,
    author: username
  });
  app.set({ newMessage: '' });
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
  console.log('Players in room', myRoom.id, players.map((p) => p.name));

  // // Start game after 2 players joined
  // if (myRoom.players.length === 3 && myRoom.host.id === playerId) {
  //   console.log('I will start the next game in 5 seconds');
  //   socket.emit('startGame');
  //
  //   setTimeout(() => {
  //     socket.emit('selectBoxes', [
  //       { content: 'A', labels: ['X', 'Y']},
  //       { content: 'B', labels: ['X', 'Y']},
  //       { content: 'C', labels: ['X', 'Y']},
  //     ])
  //   }, 5_000);
  // }
});

window.app = app;

export default app;
