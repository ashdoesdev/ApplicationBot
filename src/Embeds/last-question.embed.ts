import { RichEmbed } from "discord.js";

export class LastQuestionEmbed extends RichEmbed {
    constructor(guildColor: string) {
        super();

        this.setColor(guildColor);
        this.addField('Questions Complete!', 'Check yes ✅ to confirm you wish to apply and to submit your application.');
    }
}