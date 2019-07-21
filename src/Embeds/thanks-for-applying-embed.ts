import { RichEmbed, GuildMember } from "discord.js";

export class ThanksForApplyingEmbed extends RichEmbed {
    constructor(leadership: GuildMember[]) {
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

        this.addField('Application Successful!', 'Thank you for applying. We will reach out to you within the week to discuss next steps.');
        this.addField('If you have any questions, feel free to reach out to any member of our leadership', leadershipList);
    }
}