"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class CommunityOptionDenyEmbed extends discord_js_1.RichEmbed {
    constructor() {
        super();
        this.setColor('#60b5bc');
        this.addField('Community Option Declined', `Thank you again for applying. Please check out the Bloodsail Buccaneers server community Discord if you’d like to find other guilds to apply to: https://discord.gg/SZZ369B`);
    }
}
exports.CommunityOptionDenyEmbed = CommunityOptionDenyEmbed;
