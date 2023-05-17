const TelegramBot = require('node-telegram-bot-api');
const config = require('./config/index');
const database = require('./src/database/index');
const Film = database.model('Film'); // подключаем наш образец модели
const Cinema = database.model('Cinema');
const User = database.model('User');

const geolib = require('geolib'); // библиотка для определения расстояние между чем-то и чем-то
const helper = require('./src/helper');
const kb = require('./src/keyboard-buttons.js');
const keyboard = require('./src/keyboard');

const bot = new TelegramBot(config.TOKEN, {
  polling: true,
});

const ACTION_TYPE = {
  TOGGLE_FAV_FILM: 'tff',
  SHOW_CINEMAS: 'sc',
  SHOW_CINEMAS_MAP: 'scm',
  SHOW_FILMS: 'sf',
};

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

bot.onText(/\/start/, (msg) => {
  const text = `Здравствуйте, ${msg.from.first_name}!\n Выберете команду для начала работы: `;

  bot.sendMessage(helper.getChatId(msg), text, {
    reply_markup: {
      keyboard: keyboard.home,
    },
  });
});

// отправка отдельного фильма
bot.onText(/\/f(.+)/, (msg, [source, match]) => {
  const filmUuid = helper.getItemUuid(source);
  const chatId = helper.getChatId(msg);

  Promise.all([
    // массив промисов
    Film.findOne({ uuid: filmUuid }),
    User.findOne({ telegramId: msg.from.id }),
  ]).then(([film, user]) => {
    let isFav = false;

    if (user) {
      isFav = user.films.indexOf(film.uuid) !== -1;
    }

    const favText = isFav ? 'Удалить из избранного' : 'Добавить в избранное';

    const caption = `Название фильма: ${film.name}\nГод выпуска: ${film.year}\nРейтинг фильма: ${film.rate}\nДлительность фильма: ${film.length}\nСтрана производитель: ${film.country}`;

    bot.sendPhoto(chatId, film.picture, {
      caption: caption,

      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Показать кинотеатры',
              callback_data: JSON.stringify({
                type: ACTION_TYPE.SHOW_CINEMAS,
                cinemaUuids: film.cinemas,
              }),
            },
          ],
          [
            {
              text: `Кинопоиск ${film.name}`,
              url: film.link,
            },
          ],
          [
            {
              text: favText,
              callback_data: JSON.stringify({
                type: ACTION_TYPE.TOGGLE_FAV_FILM,
                filmUuid: film.uuid,
                isFav: isFav,
              }),
            },
          ],
        ],
      },
    });
  });
});

bot.onText(/\/c(.+)/, (msg, [source, match]) => {
  const cinemaUuid = helper.getItemUuid(source);
  const chatId = helper.getChatId(msg);

  Cinema.findOne({ uuid: cinemaUuid }).then((cinema) => {
    bot.sendMessage(chatId, `Кинотеатр ${cinema.name}`, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: cinema.name,
              url: cinema.url,
            },
          ],
          [
            {
              text: 'Показать на карте',
              callback_data: JSON.stringify({
                type: ACTION_TYPE.SHOW_CINEMAS_MAP,
                lat: cinema.location.latitude,
                lon: cinema.location.longitude,
              }),
            },
          ],
          [
            {
              text: 'Показать фильмы',
              callback_data: JSON.stringify({
                type: ACTION_TYPE.SHOW_FILMS,
                filmUuids: cinema.films,
              }),
            },
          ],
        ],
      },
    });
  });
});

bot.on('callback_query', (query) => {
  const userId = query.from.id;
  let data;
  try {
    data = JSON.parse(query.data);
  } catch (err) {
    throw new Error('Data is not an object');
  }

  const { type } = data;

  if (type === ACTION_TYPE.SHOW_CINEMAS) {
    sendCinemasByQuery(userId, { uuid: { $in: data.cinemaUuids } });
  } else if (type === ACTION_TYPE.SHOW_CINEMAS_MAP) {
    const { lat, lon } = data;
    bot.sendLocation(query.message.chat.id, lat, lon);
  } else if (type === ACTION_TYPE.TOGGLE_FAV_FILM) {
    toggleFavouriteFilm(userId, query.id, data);
  } else if (type === ACTION_TYPE.SHOW_FILMS) {
    sendFilmsByQuery(userId, { uuid: { $in: data.filmUuids } });
  }
});

bot.on('inline_query', (query) => {
  console.log(query);
  Film.find({}).then((films) => {
    const results = films.map((f) => {
      return {
        id: f.uuid,
        type: 'photo',
        photo_url: f.picture,
        thumb_url: f.picture,
        caption: `Название: ${f.name}\nГод: ${f.year}\nРейтинг: ${f.rate}\nДлинна: ${f.length}\nСтрана: ${f.country}`,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: `Кинопоиск: ${f.name}`,
                url: f.link,
              },
            ],
          ],
        },
      };
    });

    bot.answerInlineQuery(query.id, results, {
      cache_time: 0,
    });
  });
});

// --------------------------------- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ НИЖЕ

function sendFilmsByQuery(chatId, query) {
  Film.find(query).then((films) => {
    const html = films
      .map((f, i) => {
        return `<b>${i + 1}</b> ${f.name} - /f${f.uuid}`;
      })
      .join('\n');

    sendHTML(chatId, html, 'films');
  });
}

function sendHTML(chatId, html, kbName = null) {
  const options = {
    parse_mode: 'HTML',
  };

  if (kbName) {
    options['reply_markup'] = {
      keyboard: keyboard[kbName],
    };
  }

  bot.sendMessage(chatId, html, options);
}

function getCinemasInCoord(chatId, location) {
  Cinema.find({}).then((cinemas) => {
    cinemas.forEach((c) => {
      c.distance = (geolib.getDistance(location, c.location) / 1000).toFixed(0);
    });

    cinemas = _.sortBy(cinemas, 'distance');

    const html = cinemas
      .map((c, i) => {
        return `<b>${i + 1}</b> ${c.name}. <em>Расстояние</em> - <strong>${c.distance}</strong> км. /c${c.uuid}`;
      })
      .join('\n');

    sendHTML(chatId, html, 'home');
  });
}

function toggleFavouriteFilm(userId, queryId, { filmUuid, isFav }) {
  let userPromise;

  User.findOne({ telegramId: userId })
    .then((user) => {
      if (user) {
        if (isFav) {
          user.films = user.films.filter((fUuid) => fUuid !== filmUuid);
        } else {
          user.films.push(filmUuid);
        }
        userPromise = user;
      } else {
        userPromise = new User({
          telegramId: userId,
          films: [filmUuid],
        });
      }

      const answerText = isFav ? `Удалено из избранного` : `Фильм добавлен в избранное`;

      userPromise
        .save()
        .then((_) => {
          bot.answerCallbackQuery({
            callback_query_id: queryId,
            text: answerText,
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
}

function showFavouriteFilms(chatId, telegramId) {
  User.findOne({ telegramId: telegramId }).then((user) => {
    if (user) {
      Film.find({ uuid: { $in: user.films } }).then((films) => {
        let html;
        if (films.length) {
          html = films
            .map((f, i) => {
              return `<b>${i + 1}</b> ${f.name} - <b>${f.rate}</b> (/f${f.uuid})`;
            })
            .join('\n');
          html = `<b>Ваши фильмы:</b>\n${html}`;
        } else {
          html = 'Вы пока ничего не добавили';
        }

        sendHTML(chatId, html, 'home');
      });
    } else {
      sendHTML(chatId, 'Вы пока ничего не добавили', 'home');
    }
  });
}

function sendCinemasByQuery(userId, query) {
  Cinema.find(query).then((cinemas) => {
    const html = cinemas
      .map((c, i) => {
        return `<b>${i + 1}</b> ${c.name} - /c${c.uuid}`;
      })
      .join('\n');

    sendHTML(userId, html, 'home');
  });
}
