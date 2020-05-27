/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const User = require('./models/user');

app.use(express.json());

const client = require('./client/client');
app.use('/', client);

const channels = require('./routes/channels');
app.use('/channels', channels);

io.on('connection', async socket => {
  console.log('User connected', socket.handshake.query.username);
  let user;
  if (socket.handshake.query.username) {
    user = await User.findOne({ username: socket.handshake.query.username });
    if (!user) {
      user = new User({ username: socket.handshake.query.username });
      user.save();
    }
  }
  if (user) {
    socket.join(user.channels);
  }

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('chatMessage', msgData => {
    const channel = socket.rooms[msgData.channelId];
    if (!channel) {
      // TODO error this (not in room)
      console.log('Socket not in channel');
      return;
    }
    if (!msgData.text.trim()) {
      return;
    }
    io.to(msgData.channelId).emit('chatMessage', msgData.text);
  });

  socket.on('joinChannel', channelId => {
    console.log('User joined channel', channelId);
    // TODO check if channel exists
    socket.join(channelId);
    if (user) {
      User.updateOne(
        { _id: user._id },
        { $addToSet: { channels: channelId } }
      ).exec();
    }
  });
  socket.on('leaveChannel', channelId => {
    console.log('User left channel', channelId);
    socket.leave(channelId);
    if (user) {
      User.updateOne(
        { _id: user._id },
        { $pull: { channels: channelId } }
      ).exec();
    }
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
