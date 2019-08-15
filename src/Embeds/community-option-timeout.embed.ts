﻿import { RichEmbed } from "discord.js";

export class CommunityOptionTimeoutEmbed extends RichEmbed {
    constructor() {
        super();

        this.setColor('#60b5bc');
        this.addField('Timed Out', 'The bot is going to stop listening for replies now, as there has been 30 minutes of inactivity. If you wish to stick around as a community member, please reach out to our leadership to discuss.');
    }
}