import { GuildMember, RichEmbed } from "discord.js";

export class BackupApplicationEmbed extends RichEmbed {
    constructor(questions: string[][], member: GuildMember) {
        super();

        this.setColor('#60b5bc');
        this.setTitle(`Backup of application for **${member.displayName}**`);
        this.setTimestamp();

        for (let i = 0; i < questions.length; i++) {
            let safeContent = questions[i].slice(0, 1024);

            this.addField(questions[i][0], safeContent);
        }
    }
}