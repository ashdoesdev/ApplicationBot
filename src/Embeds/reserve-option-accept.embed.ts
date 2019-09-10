import { RichEmbed } from "discord.js";

export class ReserveOptionAcceptEmbed extends RichEmbed {
    constructor(charterChannel: string, scheduleChannel: string, raidiquetteChannel: string) {
        super();

        this.setColor('#60b5bc');
        this.addField('Accepted as Reserve Member',
            `Welcome to Sharp and Shiny! We look forward to sharing our Classic experience with you. 🙂\n
            If you haven’t already, please take a few minutes to read through the <#${charterChannel}>, <#${scheduleChannel}>, and <#${raidiquetteChannel}> channels at the top of our Discord - these outline how the guild will run and what expectations we have of our members.\n
            You’ll notice we have a ton of chat channels for a whole slew of topics, including individual channels for each class. You’ll find most important information, including raid and class guides, pinned in each channel, which is accessed by clicking the pin icon at the top of Discord.\n
            If you have any further questions, please don’t hesitate to reach out to an officer!\n
            Here are a few other links to get you settled in:`);
        this.addField('Sharp and Shiny guild roster:', 'https://tinyurl.com/y2wq4alq');
        this.addField('Our Battle.net guild group:', 'https://us.blizzard.com/invite/YeaNADaIlwB');
        this.addField('The Bloodsail Buccaneers server community Discord:', 'https://discord.gg/SZZ369B');
    }
}