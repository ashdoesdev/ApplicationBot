"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class CommunityOptionDenyEmbed extends discord_js_1.RichEmbed {
    constructor(appSettings) {
        super();
        this.setColor(appSettings['guildColor']);
        this.addField('Community Option Declined', appSettings['communityProposalDeclinedMessage']);
    }
}
exports.CommunityOptionDenyEmbed = CommunityOptionDenyEmbed;
