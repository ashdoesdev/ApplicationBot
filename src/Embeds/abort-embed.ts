import { RichEmbed, GuildMember } from "discord.js";

export class AbortEmbed extends RichEmbed {
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

        this.setDescription('Application process aborted. Feel free to send another /apply in the apply channel when you are ready to begin.')
        this.addField('Questions? Reach out to any member of our leadership', leadershipList);
    }
}