import { RichEmbed, GuildMember } from "discord.js";

export class ApplicationStartEmbed extends RichEmbed {
    constructor(guildColor: string) {
        super();

        this.setColor(guildColor);

        this.addField(
            'About the Application Process',
            'The application has 15 questions in total and will time out after 30 minutes of inactivity. Please reply as thoroughly as needed, but in one message per question.');

        this.addField('Ready?', 'Check yes to begin.');
    }
}