"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class QuestionEmbed extends discord_js_1.RichEmbed {
    constructor(question, number) {
        super();
        this.setColor(appSettings['guildColor']);
        this.addField(`Question ${number}`, question);
    }
}
exports.QuestionEmbed = QuestionEmbed;
