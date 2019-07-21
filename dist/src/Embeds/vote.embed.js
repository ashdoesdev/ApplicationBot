"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class VoteEmbed extends discord_js_1.RichEmbed {
    constructor(message) {
        super();
        this.setColor('#60b5bc');
        this.addField(`Vote yes ✅ or no ❌ below for ${message.member.displayName}'s application`, 'Once a majority vote has been reached, they will be notified and their rank will be updated (if applicable)');
    }
}
exports.VoteEmbed = VoteEmbed;
