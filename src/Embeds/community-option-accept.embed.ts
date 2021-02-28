import { RichEmbed } from "discord.js";

export class CommunityOptionAcceptEmbed extends RichEmbed {
    constructor(appSettings: any) {
        super();

        this.setColor(appSettings['guildColor']);
        this.addField('Accepted as Community Member', appSettings['communityProposalAcceptedMessage']);

        for (let link of Object.entries(appSettings['guildLinksForAcceptedMessages'])) {
            this.addField(link[0], link[1]);
        }
    }
}