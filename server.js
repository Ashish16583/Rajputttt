const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {
  let user = '';

  socket.on('join', (username) => {
    user = username;
    socket.broadcast.emit('message', { username: 'System', message: `${user} joined the chat.` });
  });

  socket.on('chatMessage', data => {
    io.emit('message', data);
  });

  socket.on('disconnect', () => {
    if (user) {
      io.emit('message', { username: 'System', message: `${user} left the chat.` });
    }
  });
});


const PORT = 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`http://192.168.1.35:${PORT}`);
});
