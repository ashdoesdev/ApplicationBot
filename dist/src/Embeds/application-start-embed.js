"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class ApplicationStartEmbed extends discord_js_1.RichEmbed {
    constructor() {
        super();
        this.setDescription('Cool! Thanks for reading it.');
        this.addField('About the Application Process', 'The application has 12 questions in total. Be mindful that it will time out after 30 minutes of inactivity. Please reply as thoroughly as needed, but in one message per question.');
        this.addField('Ready?', 'Check yes to begin.');
    }
}
exports.ApplicationStartEmbed = ApplicationStartEmbed;
