"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class ApplicationEmbed extends discord_js_1.RichEmbed {
    constructor(message) {
        super();
        this.setColor(appSettings['guildColor']);
        this.setTitle(`Application for ${message.member.displayName}`);
        this.setTimestamp();
    }
}
exports.ApplicationEmbed = ApplicationEmbed;
