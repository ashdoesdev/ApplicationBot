"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class LastQuestionEmbed extends discord_js_1.RichEmbed {
    constructor() {
        super();
        this.setColor('#60b5bc');
        this.addField('Questions Complete!', 'Check yes ✅ to confirm you wish to apply and to submit your application.');
    }
}
exports.LastQuestionEmbed = LastQuestionEmbed;
