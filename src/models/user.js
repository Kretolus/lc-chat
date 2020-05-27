const { Schema, model } = require ('mongoose');

const userSchema = new Schema({
  username: String,
  channels: {
    type: [
      {
        type: Schema.ObjectId,
        ref: 'Channel'
      }
    ],
    default: []
  }
});

const User = model('User', userSchema);

module.exports = User;
