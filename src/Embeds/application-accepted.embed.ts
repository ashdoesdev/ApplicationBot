import { RichEmbed } from "discord.js";

export class ApplicationAcceptedEmbed extends RichEmbed {
    constructor(appSettings: any) {
        super();

        this.setColor('#60b5bc');
        this.addField('Application Accepted!', 
            `${appSettings['applicationAcceptedMessage']}
            If you haven’t already, please take a few minutes to read through the <#${appSettings['charter']}>, <#${appSettings['schedule']}>, and <#${appSettings['raidiquette']}> channels at the top of our Discord - these outline how the guild will run and what expectations we have of our members.\n
            Here are a few other links to get you settled in:`);

        for (let link of appSettings['guildLinksForAcceptedMessage']) {
            this.addField('link[0]', 'link[1]');
        }
    }
}