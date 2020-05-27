/* eslint-disable no-console */
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const client = require('./client/client');

app.use('/', client);

io.on('connection', socket => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
