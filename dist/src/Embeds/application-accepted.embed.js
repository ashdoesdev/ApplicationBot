"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class ApplicationAcceptedEmbed extends discord_js_1.RichEmbed {
    constructor() {
        super();
        this.setColor('#60b5bc');
        this.addField('Application Accepted!', 'We are happy to let you know that your application has been accepted! Your role has been updated to applicant.');
    }
}
exports.ApplicationAcceptedEmbed = ApplicationAcceptedEmbed;
