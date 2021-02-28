"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class ReserveOptionAcceptEmbed extends discord_js_1.RichEmbed {
    constructor(appSettings) {
        super();
        this.setColor(appSettings['guildColor']);
        this.addField('Accepted as Reserve Member', appSettings['reserveProposalAcceptedMessage']);
        for (let link of appSettings['guildLinksForAcceptedMessages']) {
            this.addField(link[0], link[1]);
        }
    }
}
exports.ReserveOptionAcceptEmbed = ReserveOptionAcceptEmbed;
