import io from 'socket.io-client';

import App from './App.html';
const socket = io('http://localhost:3000');

const app = new App({
  target: document.getElementById('root'),
  data: {
    messages: [],
    newMessage: '',
    username: '',
    lobby: '',
    players: []
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
    lobby: room.id,
    players: room.players.map((p) => p.name)
  });
});

window.app = app;

export default app;
