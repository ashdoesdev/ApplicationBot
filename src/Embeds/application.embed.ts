import { Message, RichEmbed } from "discord.js";

export class ApplicationEmbed extends RichEmbed {
    constructor(message: Message) {
        super();

        this.setColor('#60b5bc');
        this.setTitle(`Application for ${message.member.displayName}`);
        this.setTimestamp();
    }
}