import { RichEmbed } from "discord.js";

export class CommunityOptionEmbed extends RichEmbed {
    constructor(appSettings: any) {
        super();

        this.setColor(appSettings['guildColor']);
        this.addField('Community Member Proposal', appSettings['communityProposalMessage']);
    }
}