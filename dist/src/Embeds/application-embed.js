"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class ApplicationEmbed extends discord_js_1.RichEmbed {
    constructor(message, questions, activeApplication) {
        super();
        this.setTitle(`Application for ${message.member.displayName}`);
        this.setTimestamp();
        for (let i = 0; i < activeApplication.replies.length; i++) {
            this.addField(questions[i + 1], activeApplication.replies[i]);
        }
    }
}
exports.ApplicationEmbed = ApplicationEmbed;
