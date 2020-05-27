const { Router } = require('express');
const Channel = require('../models/channel');

const channelsRouter = Router();

channelsRouter.route('/')
.get(async (req, res) => {
  const channels = await Channel.find();
  res.status(200).json({ channels });
}).post(async (req, res) => {
  // TODO validation of properties
  const channel = new Channel(req.body);
  await channel.save();
  res.status(201).json(channel);
});

module.exports = channelsRouter;
