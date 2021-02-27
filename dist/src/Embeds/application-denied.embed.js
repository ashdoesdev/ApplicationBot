"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class ApplicationDeniedEmbed extends discord_js_1.RichEmbed {
    constructor() {
        super();
        this.setColor(appSettings['guildColor']);
        this.addField('Application Denied', `Sorry, but your application to Sharp and Shiny has been declined.\n
            Please check out the Bloodsail Buccaneers server community Discord if you’d like to find other guilds to apply to: https://discord.gg/SZZ369B`);
    }
}
exports.ApplicationDeniedEmbed = ApplicationDeniedEmbed;
