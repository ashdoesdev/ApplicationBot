"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class AlreadyAppliedEmbed extends discord_js_1.RichEmbed {
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
        this.addField('Oops! You already have an active application', 'Thank you for applying. We will reach out to you within a week of your application submission date to discuss next steps.');
        this.addField('If you have any questions, feel free to reach out to any member of our leadership', leadershipList);
    }
}
exports.AlreadyAppliedEmbed = AlreadyAppliedEmbed;
