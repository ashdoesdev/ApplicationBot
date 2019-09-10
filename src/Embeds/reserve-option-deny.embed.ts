﻿import { RichEmbed } from "discord.js";

export class ReserveOptionDenyEmbed extends RichEmbed {
    constructor() {
        super();

        this.setColor('#60b5bc');
        this.addField('Reserve Option Declined',
            `Thank you again for applying. Please check out the Bloodsail Buccaneers server community Discord if you’d like to find other guilds to apply to: https://discord.gg/SZZ369B`);
    }
}