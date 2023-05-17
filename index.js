const TelegramBot = require('node-telegram-bot-api');
const config = require('./config/index');
const database = require('./database/index.js');
const Film = database.model('Film'); // подключаем наш образец модели
const Cinema = database.model('Cinema');
const User = database.model('User');

const bot = new TelegramBot(config.TOKEN, {
  polling: true,
});

bot.on('message', (msg) => {
  console.log('Working.', msg.from.first_name);

  const chatId = helper.getChatId(msg);

  switch (msg.text) {
    case kb.home.favourite:
      showFavouriteFilms(chatId, msg.from.id);
      break;
    case kb.home.films:
      bot.sendMessage(chatId, 'Выберите жанр: ', {
        reply_markup: { keyboard: keyboard.films },
      });
      break;
    case kb.film.comedy:
      sendFilmsByQuery(chatId, { type: 'comedy' });
      break;
    case kb.film.action:
      sendFilmsByQuery(chatId, { type: 'action' });
      break;
    case kb.film.random:
      sendFilmsByQuery(chatId, {}); // пустой объект - все фильмы которые есть
      break;
    case kb.home.cinemas:
      bot.sendMessage(chatId, 'Отправить местоположение', {
        reply_markup: {
          keyboard: keyboard.cinemas,
        },
      });
      break;
    case kb.back:
      bot.sendMessage(chatId, 'Что Вы хотите посмотреть?', {
        reply_markup: { keyboard: keyboard.home },
      });
      break;
  }
});


// --------------------------------- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ НИЖЕ

function sendFilmsByQuery(chatId, query) {
  Film.find(query).then(films => {
    const html = films.map((f, i) => {
      return `<b>${i + 1}</b> ${f.name} - /f${f.uuid}`
    }).join('\n');

    sendHTML(chatId, html, 'films');
  })
}

function sendHTML(chatId, html, kbName = null) {
  const options = {
    parse_mode: 'HTML'
  }

  if (kbName) {
    options['reply_markup'] = {
      keyboard: keyboard[kbName]
    }
  }

  bot.sendMessage(chatId, html, options);
}

function getCinemasInCoord(chatId, location) {

  Cinema.find({}).then(cinemas => {

    cinemas.forEach(c => {
      c.distance = (geolib.getDistance(location, c.location) / 1000).toFixed(0);
    })

    cinemas = _.sortBy(cinemas, 'distance');

    const html = cinemas.map((c, i) => {
      return `<b>${i + 1}</b> ${c.name}. <em>Расстояние</em> - <strong>${c.distance}</strong> км. /c${c.uuid}`
    }).join('\n')

    sendHTML(chatId, html, 'home')
  })
}

function toggleFavouriteFilm(userId, queryId, {filmUuid, isFav}) {

  let userPromise

  User.findOne({telegramId: userId})
  .then(user => {
    if (user) {
      if (isFav) {
        user.films = user.films.filter(fUuid => fUuid !== filmUuid)
      } else {
        user.films.push(filmUuid)
      }
      userPromise = user
    } else {
      userPromise = new User({
        telegramId: userId,
        films: [filmUuid]
      })
    }

    const answerText = isFav ? `Удалено из избранного` : `Фильм добавлен в избранное`

    userPromise.save()
    .then(_ => {
      bot.answerCallbackQuery({
        callback_query_id: queryId,
        text: answerText
      })
    })
    .catch(err => console.log(err))
  })
  .catch(err => console.log(err))
}

function showFavouriteFilms(chatId, telegramId) {

  User.findOne({telegramId: telegramId}).then(user => {

      if (user) {
        
        Film.find({uuid: {'$in': user.films}}).then(films => {
          let html;
          if (films.length) {
            html = films.map((f, i) => {
              return `<b>${i + 1}</b> ${f.name} - <b>${f.rate}</b> (/f${f.uuid})`
            }).join('\n')
            html = `<b>Ваши фильмы:</b>\n${html}`
          } else {
            html = 'Вы пока ничего не добавили'
          }

          sendHTML(chatId, html, 'home')
        })
      } else {
        sendHTML(chatId, 'Вы пока ничего не добавили', 'home')
      }
    })
}

function sendCinemasByQuery(userId, query) {
  Cinema.find(query).then(cinemas => {
    const html = cinemas.map((c, i) => {
      return `<b>${i + 1}</b> ${c.name} - /c${c.uuid}`;
    }).join('\n')

    sendHTML(userId, html, 'home');
  })
}