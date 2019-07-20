import { RichEmbed, GuildMember } from "discord.js";

export class ApplicationStartEmbed extends RichEmbed {
    constructor() {
        super();

        this.setDescription('Cool! Thanks for reading it.')

        this.addField(
            'About the Application Process',
            'The application process will take about 30 minutes. If you step away, be mindful that it will time out after 30 minutes of inactivity. There are 10 questions in total. Please reply as thoroughly as needed, but in one message per question. After receiving a reply to a question, it will immediately move on to the next one. If you make any mistakes, no worries, there will be a space at the end to add on anything you might have left out.');

        this.addField('Ready?', 'Let\'s begin!');
    }
}