const CharacterAI = require("node_characterai");

module.exports = class Character {

    constructor(characterAiAuthData) {
        this.charData = characterAiAuthData
        this.chat = null
        this.status = 0
        this.CharacterAI = new CharacterAI();

        this.CharacterAI.authenticateWithToken(this.charData.id)
    }

    async auth (id, callback) {
        await this.CharacterAI.authenticateAsGuest()
        return callback()
    }

    async sendMessage (message, callback) {
        const chat = await this.CharacterAI.createOrContinueChat(this.charData.bot)
        const response = await chat.sendAndAwaitResponse(message, true)
        
        return callback(response.text)
    }
}