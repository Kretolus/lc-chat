const { Schema, model } = require ('mongoose');

const channelSchema = new Schema({
  name: String
});

const Channel = model('Channel', channelSchema);

module.exports = Channel;
