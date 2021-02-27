import { RichEmbed } from "discord.js";

export class ApplicationAcceptedEmbed extends RichEmbed {
    constructor(appSettings: any) {
        super();

        this.setColor(appSettings['guildColor']);
        this.addField('Application Accepted!', appSettings['appAcceptedAdditionalMessage']);

        for (let link of appSettings['guildLinksForAcceptedMessage']) {
            this.addField(link[0], link[1]);
        }
    }
}