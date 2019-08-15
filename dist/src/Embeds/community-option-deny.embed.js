"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class CommunityOptionDenyEmbed extends discord_js_1.RichEmbed {
    constructor() {
        super();
        this.setColor('#60b5bc');
        this.addField('Best Wishes', 'Thank you again for applying. We are sorry it did not work out right now, and we wish you the best of luck.');
    }
}
exports.CommunityOptionDenyEmbed = CommunityOptionDenyEmbed;
