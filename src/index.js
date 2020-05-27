/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.json());

const client = require('./client/client');
app.use('/', client);

const channels = require('./routes/channels');
app.use('/channels', channels);

io.on('connection', socket => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('chatMessage', msgData => {
    const room = io.sockets.adapter.rooms[msgData.channelId];
    if (!room || !room.sockets[socket.id]) {
      // TODO error this (not in room)
      console.log('Socket not in channel');
      return;
    }
    io.sockets.in(msgData.channelId).emit('chatMessage', msgData.text);
  });

  socket.on('joinChannel', channelId => {
    socket.join(channelId);
  });
  socket.on('leaveChannel', channelId => {
    socket.leave(channelId);
  });
});

mongoose.connect('mongodb://localhost:27017/zaneth-lc-chat' ,{ useNewUrlParser : true, useUnifiedTopology: true }, error => {
  if (error) {
    console.log('mongodb error', error);
    return;
  }
  console.log('mongodb connected');
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
