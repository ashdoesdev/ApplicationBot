import { RichEmbed } from "discord.js";

export class QuestionEmbed extends RichEmbed {
    constructor(question: string, number: number) {
        super();

        this.setColor('#60b5bc');
        this.addField(`Question ${number}`, question);
    }
}