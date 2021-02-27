import { RichEmbed } from "discord.js";

export class ReserveOptionEmbed extends RichEmbed {
    constructor(appSettings: any) {
        super();

        this.setColor(appSettings['guildColor']);
        this.addField('Reserve Member Proposal', appSettings['reserveProposalMessage']);
    }
}