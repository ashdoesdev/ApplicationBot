"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class IntroEmbed extends discord_js_1.RichEmbed {
    constructor() {
        super();
        this.setDescription('Hey there! Thanks for your interest in applying to Sharp and Shiny. The application process will take about 30 minutes. Before starting, have you read our charter?');
        this.addField('Charter', 'link to charter channel');
    }
}
exports.IntroEmbed = IntroEmbed;
