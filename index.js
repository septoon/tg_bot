const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')

const token = '5104246922:AAEZOPz3VhmgZyFvzndQfuBj6uSQLhpIU0g'

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const startGame = async chatId => {
  await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, а ты должен ее отгадать!`)
  const randomNumber = Math.floor(Math.random() * 10)
  chats[chatId] = randomNumber
  await bot.sendMessage(chatId, 'Отгадай', gameOptions)
}

const start = () => {
  bot.setMyCommands([
    {command: '/start', description: 'Начало'},
    {command: '/info', description: 'Получить информацию'},
    {command: '/game', description: 'Игра - Угадай цифру!'}
  ])
  
  bot.on('message', async msg => {
    const text = msg.text
    const chatId = msg.chat.id
    if (text === '/start') {
      await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/571/3e6/5713e61b-1872-3ed1-baf8-9b758bdb7d9d/7.webp')
      return bot.sendMessage(chatId, 'Привет, добро пожаловать!')
    }
    if (text === '/info') {
      return bot.sendMessage(chatId, `Привет, тебя зовут ${msg.from.first_name}!`)
    }
    if (text === '/game') {
      return startGame(chatId)
    }
    return bot.sendMessage(chatId, 'Я тебя блять не понимаю')
  })
  bot.on('callback_query', async msg => {
    const data = msg.data
    const chatId = msg.message.chat.id

    if (data === '/again') {
      return startGame(chatId)
    }
    if (data === chats[chatId]) {
      return await bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру - ${chats[chatId]}`, againOptions)
    } else {
      return await bot.sendMessage(chatId, `Неверно! Я загадал цифру - ${chats[chatId]}`, againOptions)
    }

    bot.sendMessage(chatId, `Ты выбрал цифру - ${data}`)
  })
}

start()