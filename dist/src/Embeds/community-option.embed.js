"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class CommunityOptionEmbed extends discord_js_1.RichEmbed {
    constructor() {
        super();
        this.setColor(appSettings['guildColor']);
        this.addField('Community Member Proposal', 'We\'re unable to accept your app for a raid position at this time. However, we would love to have you as a community member if you wish to stick around. Check yes below if you wish to accept. Please reach out if you have any questions regarding this decision.');
    }
}
exports.CommunityOptionEmbed = CommunityOptionEmbed;
