const mongoose = require('mongoose');
const config = require('../config');
const Film = require('./models/film.model').FilmSchema;

mongoose.connect(config.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('connected', () => console.log('connected to mongoDB'));
mongoose.connection.once('disconnected', () => console.log('disconnected from mongoDB'));

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('mongoose disconnected from mongodb through app termination');
    process.exit(0);
  });
});

mongoose.model('Film', Film); // при помощи метода model, мы создаем модель фильма

module.exports = mongoose.connection;
