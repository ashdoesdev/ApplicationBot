"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class ApplicationEmbed extends discord_js_1.RichEmbed {
    constructor(message, questions, activeApplication) {
        super();
        this.setColor('#60b5bc');
        this.setTitle(`Application for ${message.member.displayName}`);
        this.setTimestamp();
        for (let i = 0; i < activeApplication.replies.length; i++) {
            let safeContent = activeApplication.replies[i].content.slice(1, 1024);
            this.addField(questions[i + 1], safeContent || 'Error saving message. Check logs.');
        }
    }
}
exports.ApplicationEmbed = ApplicationEmbed;
