﻿import { RichEmbed } from "discord.js";

export class CommunityOptionTimeoutEmbed extends RichEmbed {
    constructor(guildColor: string) {
        super();

        this.setColor(guildColor);
        this.addField('Timed Out', 'The bot is going to stop listening for replies now due to 24 hours of inactivity. If you wish to stick around as a community member, please reach out to our leadership to discuss.');
    }
}