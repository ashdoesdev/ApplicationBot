import { RichEmbed } from "discord.js";

export class ApplicationAcceptedEmbed extends RichEmbed {
    constructor(appSettings: any) {
        super();

        this.setColor(appSettings['guildColor']);
        this.addField('Application Accepted!', appSettings['appAcceptedMessage']);

        for (let link of Object.entries(appSettings['guildLinksForAcceptedMessages'])) {
            this.addField(link[0], link[1]);
        }
    }
}