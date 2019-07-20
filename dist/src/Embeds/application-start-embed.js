"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class ApplicationStartEmbed extends discord_js_1.RichEmbed {
    constructor(leadership) {
        super();
        let leadershipList = '';
        for (let i = 0; i < leadership.length; i++) {
            if (i === leadership.length - 1) {
                if (i === 0) {
                    leadershipList += `**${leadership[i].displayName}**`;
                }
                else {
                    leadershipList += `or **${leadership[i].displayName}**`;
                }
            }
            else {
                leadershipList += `**${leadership[i].displayName}**, `;
            }
        }
        this.setDescription('Cool! Thanks for reading it.');
        this.addField('Questions? Reach out to any member of our leadership', leadershipList);
        this.addField('About the Application Process', 'The application process will take about 30 minutes. If you step away, be mindful that it will time out after 30 minutes of inactivity. There are 10 questions in total. Please reply as thoroughly as needed, but in one message per question. After receiving a reply to a question, it will immediately move on to the next one. If you make any mistakes, no worries, there will be a space at the end to add on anything you might have left out.');
        this.addField('Ready?', 'Let\'s begin!');
    }
}
exports.ApplicationStartEmbed = ApplicationStartEmbed;
