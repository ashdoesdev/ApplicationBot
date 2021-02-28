import { RichEmbed } from "discord.js";

export class ReserveOptionDenyEmbed extends RichEmbed {
    constructor(appSettings: any) {
        super();

        this.setColor(appSettings['guildColor']);
        this.addField('Reserve Option Declined', appSettings['reserveProposalDeclinedMessage']);
    }
}