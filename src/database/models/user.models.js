const mongoose = require('mongoose');

const Schema = mongoose.Schema;

module.exports.UserSchema = new Schema({
  telegramId: {
    type: Number,
    required: true,
  },
  films: {
    type: [String],
    default: [],
  },
});
