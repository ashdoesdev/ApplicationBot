import { RichEmbed } from "discord.js";

export class QuestionEmbed extends RichEmbed {
    constructor(question: string, number: number, guildColor: string) {
        super();

        this.setColor(guildColor);
        this.addField(`Question ${number}`, question);
    }
}