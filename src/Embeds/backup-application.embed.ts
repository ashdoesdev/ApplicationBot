import { GuildMember, RichEmbed } from "discord.js";

export class BackupApplicationEmbed extends RichEmbed {
    constructor(questions: string[][], member: GuildMember) {
        super();

        this.setColor('#60b5bc');
        this.setTitle(`Backup of application for **${member.displayName}**`);
        this.setTimestamp();

        for (let i = 0; i < questions.length; i++) {
            this.addField(questions[i][0], questions[i][1]);
        }
    }
}