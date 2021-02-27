"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class IntroEmbed extends discord_js_1.RichEmbed {
    constructor(charterChannel, scheduleChannel) {
        super();
        this.setColor(appSettings['guildColor']);
        this.setDescription(`Hey there! Thanks for your interest in applying to Sharp and Shiny. Before starting, have you read our <#${charterChannel}> and does our raid <#${scheduleChannel}> work for you?`);
        this.addField('Please Confirm', 'Check yes to continue and confirm that you have read our charter and schedule.');
    }
}
exports.IntroEmbed = IntroEmbed;
