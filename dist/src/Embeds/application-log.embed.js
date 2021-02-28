"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class ApplicationLogEmbed extends discord_js_1.RichEmbed {
    constructor(member, field1, field2, guildColor) {
        super();
        this.setColor(guildColor);
        if (member) {
            this.addField(field1, field2);
            this.setFooter(member);
        }
    }
}
exports.ApplicationLogEmbed = ApplicationLogEmbed;
