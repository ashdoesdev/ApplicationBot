import { RichEmbed } from "discord.js";

export class CommunityOptionDenyEmbed extends RichEmbed {
    constructor(appSettings: any) {
        super();

        this.setColor(appSettings['guildColor']);
        this.addField('Community Option Declined', appSettings['communityProposalDeclinedMessage']);
    }
}