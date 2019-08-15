"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class CommunityOptionAcceptEmbed extends discord_js_1.RichEmbed {
    constructor() {
        super();
        this.setColor('#60b5bc');
        this.addField('Welcome!', 'We are happy to have you as a community member. Your role has been updated accordingly.');
    }
}
exports.CommunityOptionAcceptEmbed = CommunityOptionAcceptEmbed;
