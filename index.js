const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = '7350476503:AAFzuarhklMMZxd3pgD4ieDxCK-j4yOfl64';
const bot = new TelegramBot(token, { polling: true });

const apiBaseUrl = 'https://taqveem-with-swagger-production.up.railway.app/api/taqveem';
const duaBaseUrl = 'https://taqveem-with-swagger-production.up.railway.app/api/dua';
let messageId;

const getTodaySerial = () => {
  const today = new Date('2025-02-28');
  const startOfRamadan = new Date('2025-02-28');
  return Math.ceil((today - startOfRamadan) / (1000 * 60 * 60 * 24)) + 1;
};

const getDua = async (duaSerial) => {
  try {
    const response = await axios.get(`${duaBaseUrl}/${duaSerial}`);
    const dua = response.data;
    return `${dua.title}:\n${dua.arabic_doa}\nO'qilishi:\n${dua.transliteration}\nTarjimasi:\n${dua.translate}`;
  } catch (error) {
    return `❌ Duo maʼlumotini olishda xatolik yuz berdi.`;
  }
};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `Assalomu alaykum <b>${msg.from.first_name}</b>! Ramazon taqvimi botiga xush kelibsiz.`, {
    reply_markup: {
      keyboard: [["📅 Bugun", "📅 Ertaga"], ["📆 Bir oylik taqvim"]],
      resize_keyboard: true,
      one_time_keyboard: false
    },
    parse_mode: 'HTML'
  });
});

const sendTodaySchedule = async (chatId) => {
  const todaySerial = getTodaySerial();
  try {
    const response = await axios.get(`${apiBaseUrl}/${todaySerial}`);
    const data = response.data;
    const saharlikDua = await getDua(1);
    const iftorlikDua = await getDua(2);
    const message = `Sana: ${data.date}\nSaharlik: ${data.sehri}\n${saharlikDua}\nIftorlik: ${data.ifter}\n${iftorlikDua}`;
    bot.sendMessage(chatId, message);
  } catch (error) {
    bot.sendMessage(chatId, '❌ Maʼlumot olishda xatolik yuz berdi.');
  }
};

bot.onText(/(📅 Bugun|\/bugun)/, (msg) => {
  sendTodaySchedule(msg.chat.id);
});

const sendTomorrowSchedule = async (chatId) => {
  const tomorrowSerial = getTodaySerial() + 1;
  try {
    const response = await axios.get(`${apiBaseUrl}/${tomorrowSerial}`);
    const data = response.data;
    const saharlikDua = await getDua(1);
    const iftorlikDua = await getDua(2);
    const message = `Sana: ${data.date}\nSaharlik: ${data.sehri}\n${saharlikDua}\nIftorlik: ${data.ifter}\n${iftorlikDua}`;
    bot.sendMessage(chatId, message);
  } catch (error) {
    bot.sendMessage(chatId, '❌ Maʼlumot olishda xatolik yuz berdi.');
  }
};

bot.onText(/(📅 Ertaga|\/erta)/, (msg) => {
  sendTomorrowSchedule(msg.chat.id);
});

bot.onText(/\/kun (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const serial = match[1];
  try {
    const response = await axios.get(`${apiBaseUrl}/${serial}`);
    const data = response.data;
    const saharlikDua = await getDua(1);
    const iftorlikDua = await getDua(2);
    const message = `Sana: ${data.date}\nSaharlik: ${data.sehri}\n${saharlikDua}\nIftorlik: ${data.ifter}\n${iftorlikDua}`;
    bot.sendMessage(chatId, message);
  } catch (error) {
    bot.sendMessage(chatId, '❌ Maʼlumot olishda xatolik yuz berdi. Serialni toʻgʻri kiriting.');
  }
});

bot.onText(/(📆 Bir oylik taqvim)/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    const response = await axios.get(`${apiBaseUrl}`);
    const data = response.data;
    let message = "Bir oylik taqvim:\n";
    data.forEach(day => {
			const dayNumber = day.date.toString().split(' ')[0]
			const dayLength = dayNumber.length


			if (dayLength === 1) {
				message += `   ${day.date} - ☀ Saharlik: ${day.sehri} - 🌙 Iftorlik: ${day.ifter}\n`;
			} else{
				message += ` ${day.date} - ☀ Saharlik: ${day.sehri} - 🌙 Iftorlik: ${day.ifter}\n`;
			}
    });
    bot.sendMessage(chatId, message);
  } catch (error) {
    bot.sendMessage(chatId, '❌ Oylik maʼlumot olishda xatolik yuz berdi.');
  }
});
