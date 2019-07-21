import { RichEmbed } from "discord.js";

export class QuestionEmbed extends RichEmbed {
    constructor(question: string, number: number) {
        super();

        this.addField(`Question ${number}`, question);
    }
}