"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class ApplicationDeniedEmbed extends discord_js_1.RichEmbed {
    constructor() {
        super();
        this.setColor('#60b5bc');
        this.addField('Application Denied', 'Please reach out if you have any questions regarding this decision. We wish you the best of luck.');
    }
}
exports.ApplicationDeniedEmbed = ApplicationDeniedEmbed;
