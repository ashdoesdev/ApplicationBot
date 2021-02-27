import { RichEmbed } from "discord.js";

export class ReserveOptionAcceptEmbed extends RichEmbed {
    constructor(appSettings: any) {
        super();

        this.setColor(appSettings['guildColor']);
        this.addField('Accepted as Reserve Member', appSettings['reserveProposalAcceptedMessage']);

        for (let link of appSettings['guildLinksForAcceptedMessages']) {
            this.addField(link[0], link[1]);
        }
    }
}