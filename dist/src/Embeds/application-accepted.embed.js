"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class ApplicationAcceptedEmbed extends discord_js_1.RichEmbed {
    constructor(appSettings) {
        super();
        this.setColor(appSettings['guildColor']);
        this.addField('Application Accepted!', appSettings['appAcceptedAdditionalMessage']);
        for (let link of appSettings['guildLinksForAcceptedMessage']) {
            this.addField(link[0], link[1]);
        }
    }
}
exports.ApplicationAcceptedEmbed = ApplicationAcceptedEmbed;
