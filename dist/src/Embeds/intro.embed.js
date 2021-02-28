"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class IntroEmbed extends discord_js_1.RichEmbed {
    constructor(appSettings) {
        super();
        this.setColor(appSettings['guildColor']);
        this.setDescription(`Hey there! Thanks for your interest in applying to ${appSettings['guildName']}. Before starting, please confirm you have read these important channels:`);
        let channels = '';
        for (let channel of Object.entries(appSettings['importantReadOnlyChannels'])) {
            channels += `<#${channel[1]}>\n`;
        }
        this.addField('Important channels', channels);
        this.addField('Please Confirm', 'Check yes to continue and confirm that you have read these');
    }
}
exports.IntroEmbed = IntroEmbed;
