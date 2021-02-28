"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class CommunityOptionAcceptEmbed extends discord_js_1.RichEmbed {
    constructor(appSettings) {
        super();
        this.setColor(appSettings['guildColor']);
        this.addField('Accepted as Community Member', appSettings['communityProposalAcceptedMessage']);
        for (let link of appSettings['guildLinksForAcceptedMessages']) {
            this.addField(link[0], link[1]);
        }
    }
}
exports.CommunityOptionAcceptEmbed = CommunityOptionAcceptEmbed;
