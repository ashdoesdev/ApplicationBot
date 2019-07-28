"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class IntroEmbed extends discord_js_1.RichEmbed {
    constructor() {
        super();
        this.setColor('#60b5bc');
        this.setDescription('Hey there! Thanks for your interest in applying to Sharp and Shiny. Before starting, have you read our <#562899440952934403> and does our raid <#562785022059347978> work for you?');
    }
}
exports.IntroEmbed = IntroEmbed;
