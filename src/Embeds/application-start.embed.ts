import { RichEmbed, GuildMember } from "discord.js";

export class ApplicationStartEmbed extends RichEmbed {
    constructor() {
        super();

        this.setColor('#60b5bc');

        this.addField(
            'About the Application Process',
            'The application has 12 questions in total. Be mindful that it will time out after 30 minutes of inactivity. Please reply as thoroughly as needed, but in one message per question.');

        this.addField('Ready?', 'Check yes to begin.');
    }
}