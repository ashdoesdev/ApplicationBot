"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class ReserveOptionEmbed extends discord_js_1.RichEmbed {
    constructor(appSettings) {
        super();
        this.setColor(appSettings['guildColor']);
        this.addField('Reserve Member Proposal', appSettings['reserveProposalMessage']);
    }
}
exports.ReserveOptionEmbed = ReserveOptionEmbed;
