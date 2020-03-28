import { GuildMember, RichEmbed } from "discord.js";

export class BackupApplicationEmbed extends RichEmbed {
    constructor(questions: string[][], member: GuildMember | string) {
        super();

        this.setColor('#60b5bc');
        if (member instanceof GuildMember) {
            this.setTitle(`Backup of application for **${(member as GuildMember).displayName}**`);
        } else {
            this.setTitle(`Backup of application for **${member}**`);
        }

        this.setTimestamp();

        for (let i = 0; i < questions.length; i++) {
            let safeContent = questions[i][1].slice(0, 1024);

            this.addField(questions[i][0], safeContent);
        }
    }
}