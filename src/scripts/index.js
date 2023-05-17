const database = require('../database/index');
const Film = database.model('Film');
const Cinema = database.model('Cinema');

const { mockData } = require('../mockData');

async function main() {
  await Film.deleteMany({});
  for (const mockFilm of mockData.films) {
    await Film.create(mockFilm);
  }

  await Film.deleteMany({});
  for (const mockFilm of mockData.cinemas) {
    await Cinema.create(mockFilm);
  }
}

main()
  .then(() => console.log('DONE'))
  .catch((e) => console.log('SCRIPT ERROR', e));
