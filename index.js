const TelegramBot = require('node-telegram-bot-api');
const config = require('./config/index');

const bot = new TelegramBot(config.TOKEN, {
  polling: true,
});