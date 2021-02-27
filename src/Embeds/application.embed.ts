import { Message, RichEmbed } from "discord.js";

export class ApplicationEmbed extends RichEmbed {
    constructor(message: Message, guildColor: string) {
        super();

        this.setColor(guildColor);
        this.setTitle(`Application for ${message.member.displayName}`);
        this.setTimestamp();
    }
}