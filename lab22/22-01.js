const TelegramBot = require('node-telegram-bot-api');
const { Client } = require('pg');
const cron = require('node-cron');
const axios = require('axios');

const token = '6995097449:AAE5TQVvg6V6HMhtB0CwnUaH4Et9Uwttw98';
const bot = new TelegramBot(token, { polling: true });

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'tea-shop',
  password: '1234',
  port: 5432,
});
client.connect();

client.query(`
  CREATE TABLE IF NOT EXISTS subscribers (
    id SERIAL PRIMARY KEY,
    userId BIGINT UNIQUE
  );
`, (err) => {
  if (err) {
    console.error('Ошибка при создании таблицы', err.stack);
  } else {
    console.log('Таблица создана или уже существует');
  }
});


const facts = [
    "Случайный факт: Земля вращается вокруг Солнца.",
    "Случайный факт: Вода кипит при 100 градусах Цельсия.",
    "Случайный факт: В космосе нет звуков.",
    "Случайный факт: Средний возраст котов составляет 15 лет.",
    "Случайный факт: Человеческое сердце бьется примерно 100 000 раз в день."
  ];
  
  const sendRandomFact = () => {
    const randomFact = facts[Math.floor(Math.random() * facts.length)];
    client.query("SELECT userId FROM subscribers", (err, res) => {
      if (err) {
        console.error(err.stack);
        return;
      }
      res.rows.forEach(row => {
        bot.sendMessage(row.userid, randomFact);
      });
    });
  };

cron.schedule('*/10 * * * * *', sendRandomFact);

// /start и /help
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Добро пожаловать! Используйте команды /subscribe, /unsubscribe, /weather, /joke, /cat.');
});

// /subscribe
bot.onText(/\/subscribe/, (msg) => {
  const chatId = msg.chat.id;
  client.query("INSERT INTO subscribers (userId) VALUES ($1) ON CONFLICT (userId) DO NOTHING", [chatId], (err) => {
    if (err) {
      console.error(err.stack);
      return;
    }
    bot.sendMessage(chatId, 'Вы подписаны на ежедневную рассылку.');
  });
});

// /unsubscribe
bot.onText(/\/unsubscribe/, (msg) => {
  const chatId = msg.chat.id;
  client.query("DELETE FROM subscribers WHERE userId = $1", [chatId], (err) => {
    if (err) {
      console.error(err.stack);
      return;
    }
    bot.sendMessage(chatId, 'Вы отписаны от ежедневной рассылки.');
  });
});

// /weather
bot.onText(/\/weather (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const city = match[1];
  const apiKey = '8d81a8d0e3c9366e915b1cd07dbbc9f1';
  //const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=ru`;
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  try {
    const response = await axios.get(url);
    const weather = response.data;
    const message = `
    Погода в ${weather.name}:
    Температура: ${weather.main.temp}°C
    Влажность: ${weather.main.humidity}%
    Давление: ${weather.main.pressure} гПа
    Ветер: ${weather.wind.speed} м/с
    Восход: ${new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}
    Закат: ${new Date(weather.sys.sunset * 1000).toLocaleTimeString()}
    Продолжительность дня: ${((weather.sys.sunset - weather.sys.sunrise) / 3600).toFixed(2)} часов
    `;
    bot.sendMessage(chatId, message);
  } catch (error) {
    bot.sendMessage(chatId, 'Не удалось получить данные о погоде. Проверьте название города.');
  }
});

// /joke
bot.onText(/\/joke/, async (msg) => {
  const chatId = msg.chat.id;
  const url = 'https://official-joke-api.appspot.com/random_joke';

  try {
    const response = await axios.get(url);
    const joke = response.data;
    bot.sendMessage(chatId, `${joke.setup} - ${joke.punchline}`);
  } catch (error) {
    bot.sendMessage(chatId, 'Не удалось получить шутку.');
  }
});

// /cat
bot.onText(/\/cat/, async (msg) => {
  const chatId = msg.chat.id;
  const url = 'https://api.thecatapi.com/v1/images/search';

  try {
    const response = await axios.get(url);
    const catImage = response.data[0].url;
    bot.sendPhoto(chatId, catImage);
  } catch (error) {
    bot.sendMessage(chatId, 'Не удалось получить изображение кота.');
  }
});


bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text.toLowerCase();

  if (text === 'привет') {
    const stickerId = 'CAACAgIAAxkBAAEFgx9mSHUAAUJb0OUvFFBQCXUhCANd2nYAAg8KAAJWQcFJY71qZ-O6BGQ1BA';
    bot.sendSticker(chatId, stickerId);
  } else {
    bot.sendMessage(chatId, `Эхо: ${msg.text}`);
  }
});
