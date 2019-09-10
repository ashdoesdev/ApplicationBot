"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class ApplicationStartEmbed extends discord_js_1.RichEmbed {
    constructor() {
        super();
        this.setColor('#60b5bc');
        this.addField('About the Application Process', 'The application has 14 questions in total and will time out after 30 minutes of inactivity. Please reply as thoroughly as needed, but in one message per question.');
        this.addField('Ready?', 'Check yes to begin.');
    }
}
exports.ApplicationStartEmbed = ApplicationStartEmbed;
