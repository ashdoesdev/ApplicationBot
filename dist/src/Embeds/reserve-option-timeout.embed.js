"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class ReserveOptionTimeoutEmbed extends discord_js_1.RichEmbed {
    constructor() {
        super();
        this.setColor('#60b5bc');
        this.addField('Timed Out', 'The bot is going to stop listening for replies now due to 24 hours of inactivity. If you wish to join as a reserve member, please reach out to our leadership to discuss.');
    }
}
exports.ReserveOptionTimeoutEmbed = ReserveOptionTimeoutEmbed;
