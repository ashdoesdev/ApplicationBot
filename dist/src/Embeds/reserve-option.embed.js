"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class ReserveOptionEmbed extends discord_js_1.RichEmbed {
    constructor() {
        super();
        this.setColor(appSettings['guildColor']);
        this.addField('Reserve Member Proposal', 'We\'re unable to accept your app for a raid position at this time. However, we can slot you as a reserve if desired. Reserve members are prioritized to transition to raider as raid slots become available. Check yes below if you wish to accept. Please reach out if you have any questions.');
    }
}
exports.ReserveOptionEmbed = ReserveOptionEmbed;
