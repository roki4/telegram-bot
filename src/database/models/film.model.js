const mongoose = require('mongoose');

const Schema = mongoose.Schema;

module.exports.FilmSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    require: true,
  },
  uuid: {
    type: String,
    require: true,
  },
  year: {
    type: String,
  },
  rate: {
    type: Number,
  },
  length: {
    type: String,
  },
  country: {
    type: String,
  },
  link: {
    type: String,
  },
  picture: {
    type: String,
  },
  cinemas: {
    // хранятся id кинотеатров, в которых показывается данный фильм
    type: [String], // массив строк
    default: [], // пустой массив по умолчанию
  },
});
