const TelegramBot = require('node-telegram-bot-api');
const config = require('./config/index');
const database = require('./database/index.js');
const Film = database.model('Film'); // подключаем наш образец модели
const Cinema = database.model('Cinema');
const User = database.model('User');

const bot = new TelegramBot(config.TOKEN, {
  polling: true,
});
