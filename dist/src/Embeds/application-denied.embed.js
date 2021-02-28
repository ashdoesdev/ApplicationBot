"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class ApplicationDeniedEmbed extends discord_js_1.RichEmbed {
    constructor(appSettings) {
        super();
        this.setColor(appSettings['guildColor']);
        this.addField('Application Denied', appSettings['appDeniedMessage']);
    }
}
exports.ApplicationDeniedEmbed = ApplicationDeniedEmbed;
