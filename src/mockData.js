module.exports.mockData = {
  films: [
    {
      uuid: 'f123',
      name: 'Начало',
      type: 'action',
      year: '2010',
      rate: 8.665,
      length: '2:28',
      country: 'США',
      link: 'https://www.kinopoisk.ru/film/nachalo-2010-447301',
      picture: 'https://www.kinopoisk.ru/images/film_big/447301.jpg',
      cinemas: ['c123', 'c345'],
    },
    {
      uuid: 'f234',
      name: 'Гладиатор',
      type: 'action',
      year: '2000',
      rate: 8.592,
      length: '2:35',
      country: 'США',
      link: 'https://www.kinopoisk.ru/film/gladiator-2000-474',
      picture: 'https://www.kinopoisk.ru/images/film_big/474.jpg',
      cinemas: ['c123', 'c456'],
    },
    {
      uuid: 'f345',
      name: 'Матрица',
      type: 'action',
      year: '1999',
      rate: 8.491,
      length: '2:16',
      country: 'США',
      link: 'https://www.kinopoisk.ru/film/matrica-1999-301',
      picture: 'https://st.kp.yandex.net/images/film_iphone/iphone360_301.jpg',
      cinemas: ['c345', 'c234'],
    },
    {
      uuid: 'f456',
      name: 'Брат',
      type: 'action',
      year: '1997',
      rate: 8.491,
      length: '1:40',
      country: 'Россия',
      link: 'https://www.kinopoisk.ru/film/brat-1997-41519',
      picture: 'https://www.kinopoisk.ru/images/film_big/41519.jpg',
      cinemas: ['c345', 'c456'],
    },
    {
      uuid: 'f567',
      name: 'Карты, деньги, два ствола',
      type: 'comedy',
      year: '1998',
      rate: 8.543,
      length: '1:47',
      country: 'Великобритания',
      link: 'https://www.kinopoisk.ru/film/karty-dengi-dva-stvola-1998-522',
      picture: 'https://st.kp.yandex.net/images/film_iphone/iphone360_522.jpg',
      cinemas: ['c345', 'c567', 'c123'],
    },
    {
      uuid: 'f678',
      name: 'Форрест Гамп',
      type: 'comedy',
      year: '1994',
      rate: 8.922,
      length: '2:22',
      country: 'США',
      link: 'https://www.kinopoisk.ru/film/forrest-gamp-1994-448',
      picture: 'https://st.kp.yandex.net/images/film_iphone/iphone360_448.jpg',
      cinemas: ['c234', 'c123'],
    },
    {
      uuid: 'f789',
      name: '1+1',
      type: 'comedy',
      year: '2011',
      rate: 8.812,
      length: '1:52',
      country: 'Франция',
      link: 'https://www.kinopoisk.ru/film/11-2011-535341',
      picture: 'https://st.kp.yandex.net/images/film_iphone/iphone360_535341.jpg',
      cinemas: ['c567', 'c345', 'c456'],
    },
    {
      uuid: 'f890',
      name: 'Достучаться до небес',
      type: 'comedy',
      year: '1997',
      rate: 8.634,
      length: '1:27',
      country: 'Германия',
      link: 'https://www.kinopoisk.ru/film/dostuchatsya-do-nebes-1997-32898',
      picture: 'https://st.kp.yandex.net/images/film_iphone/iphone360_32898.jpg',
      cinemas: ['c456', 'c123'],
    },
  ],
  cinemas: [
    {
      uuid: 'c123',
      name: 'World Cinema Plus',
      location: {
        latitude: 59.883744,
        longitude: 30.268672,
      },
      url: 'http://world-cinema-plus.com',
      films: ['f890', 'f678', 'f567', 'f123', 'f234'],
    },
    {
      uuid: 'c234',
      name: 'The Greatest Cinema',
      location: {
        latitude: 59.843103,
        longitude: 30.305378,
      },
      url: 'http://the-greatest-cinema.com',
      films: ['f345', 'f678'],
    },
    {
      uuid: 'c345',
      name: 'Watch your eyes',
      location: {
        latitude: 60.02484,
        longitude: 30.390167,
      },
      url: 'http://watch-your-eyes.com',
      films: ['f123', 'f345', 'f456', 'f567', 'f789'],
    },
    {
      uuid: 'c456',
      name: 'Happy hours',
      location: {
        latitude: 59.828174,
        longitude: 30.377967,
      },
      url: 'http://happy-hours.com',
      films: ['f234', 'f456', 'f789', 'f890'],
    },
    {
      uuid: 'c567',
      name: 'Family Cinema',
      location: {
        latitude: 60.000354,

        longitude: 30.194079,
      },
      url: 'http://family-cinema.com',
      films: ['f567', 'f789'],
    },
  ],
};
