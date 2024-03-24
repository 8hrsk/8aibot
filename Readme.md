# Get started

Create a `.env` file with 
```env
TELEGRAM_HASH = telegram api hash
TELEGRAM_API_ID = telegram api id
TELEGRAM_PHONE = your phone number
TELEGRAM_PASSWORD = telegram account password

DB_NAME = database username
DB_PASSWORD = database user password
DB_HOST = database address
DB_DATABASE = telegram_sessions || your DB name

CHAI_ID = character chat ID
CHAI_BOT = Character.ai key
```

After that you can start bot with `npm start` or `node bot.js`

To get CHAI_ID you have to go to chat with any character, open devtools and in cookies find this: ![image](https://github.com/8hrsk/8aibot/assets/125183117/62913390-16a0-493c-9748-2dd5c7a8260e)
Text after Token is your ID
