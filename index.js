const TelegramAPI = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = "5115919814:AAFIVuw0t6KyeuPaULWFWZLUVuJeBooyenk"

const bot = new TelegramAPI(token, {polling: true})

const chats = {}

const startGame = async (chatId) => {
    await bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/5fb/e86/5fbe8646-6371-463c-ba7d-bbc08ab0b860/192/8.webp')
    await bot.sendMessage(chatId, `Я загадал число от 0 до 9.`)
    const randomNumber = Math.floor(Math.random() * 10) 
    chats[chatId] = randomNumber.toString()
    await bot.sendMessage(chatId, `Cможешь его угадать?`, gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {
            command: '/start', 
            description: 'Начальное приветсвие'
        },
        {
            command: '/info', 
            description: 'Что бот знает?'
        },
        {
            command: '/game', 
            description: 'Игра "Отгадай число"'
        },
    ])

    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/5fb/e86/5fbe8646-6371-463c-ba7d-bbc08ab0b860/6.webp')
            return bot.sendMessage(chatId, `Ты написал сообщение: "${text}"`)
        } else if (text === '/info') {
            return bot.sendMessage(chatId, `Вас зовут ${msg.from.first_name} ${msg.from.last_name}`)
        } else if (text === '/game') {
            return startGame(chatId)
        } 

        return bot.sendMessage(chatId, 'Я вас не понимаю, попробуйте ещё раз')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id

        if (data === '/again') {
            return startGame(chatId)
        }

        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Верно, я загадал ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `Увы! Ты не угадал, я загадал ${chats[chatId]}`, againOptions)
        }
    })
}

start()