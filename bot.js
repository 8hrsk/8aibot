
const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const { NewMessage } = require('telegram/events');
require('dotenv').config();
const input = require('input');

const Database = require('./Database.js')
const Character = require('./characterAi');

const TelegramData = {
    apiId: Number(process.env.TELEGRAM_API_ID),
    apiHash: process.env.TELEGRAM_HASH,
    phoneNumber: process.env.TELEGRAM_PHONE,
    password: process.env.TELEGRAM_PASSWORD
}

const DatabaseData = {
    host: process.env.DB_HOST,
    user: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
}

const CharacterData = {
    id: process.env.CHAI_ID,
    bot: process.env.CHAI_BOT
}

const DB = new Database(DatabaseData);
const CharacterAI = new Character(CharacterData);

console.log('starting...', TelegramData, DatabaseData, CharacterData);

const apiId = TelegramData.apiId;
const apiHash = TelegramData.apiHash;

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
    console.log('Bot is starting...');

    let session = await DB.getSession((sessionId) => {
        return sessionId?.session;
    });

    if (!session) {
        session = ''
    }

    const stringSession = new StringSession(session);

    const client = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 5
    });

    await client.start({
        phoneNumber: () => { return process.env.TELEGRAM_PHONE },
        password: () => { return process.env.TELEGRAM_PASSWORD },
        phoneCode: async () => {
            return await input.text('Enter the code you received:');
        },
        onError: (err) => {
            console.log(err);
        }
    })


    if (!session) {
        const newSession = client.session.save();

        DB.setSession({ session: newSession });
    }

    await client.sendMessage("me", { message: "On air!" });
    const me = await client.getMe();
    dialogs = await client.getDialogs()

    async function eventPrint(event) {
        const message = event.message;

        if (message.out == true) {
            if (message.message[0] == '~') {
                const prompt = message.message.slice(1);
                // client.editMessage(Number(message.chatId), message.id, { message: '```' + prompt + '\nProcessing...```' })
                message.edit({text: '````' + prompt + '\nProcessing...````'})

                const response = await CharacterAI.sendMessage(prompt, (response) => {
                    // client.sendMessage(message.chatId, { message: response })
                    // client.editMessage(Number(message.chatId), message.id, { message: '`' + response + '`' })
                    message.edit({text: '`' + prompt + '\n\n' + response + '`'})
                })
            }
        }
    }

    // adds an event handler for new messages
    client.addEventHandler(eventPrint, new NewMessage({}));
})()