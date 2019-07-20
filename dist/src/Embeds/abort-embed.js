"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class AbortEmbed extends discord_js_1.RichEmbed {
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
        this.setDescription('Application process aborted. Feel free to send another /apply in the apply channel when you are ready to begin.');
        this.addField('Questions? Reach out to any member of our leadership', leadershipList);
    }
}
exports.AbortEmbed = AbortEmbed;
