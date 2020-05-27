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

  socket.on('chat message', msg => {
    io.emit('chat message', msg);
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
