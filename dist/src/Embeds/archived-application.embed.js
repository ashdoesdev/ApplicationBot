"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class ArchivedApplicationEmbed extends discord_js_1.RichEmbed {
    constructor(reaction, message, questions, activeApplication) {
        super();
        this.setColor('#60b5bc');
        this.setTitle(`Application for ${message.member.displayName} ${reaction}`);
        this.setTimestamp();
        for (let i = 0; i < activeApplication.replies.length; i++) {
            this.addField(questions[i + 1], activeApplication.replies[i]);
        }
    }
}
exports.ArchivedApplicationEmbed = ArchivedApplicationEmbed;
