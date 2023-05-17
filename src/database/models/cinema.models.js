const mongoose = require('mongoose');

const Schema = mongoose.Schema;

module.exports.CinemaSchema = new Schema({
  uuid: {
    type: String,
    required: true, // обязательность
  },
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  location: {
    type: Schema.Types.Mixed, // схема, перечисление типов, mixed
  },
  films: {
    type: [String],
    default: [],
  },
});
