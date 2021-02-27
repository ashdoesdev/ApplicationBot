import { RichEmbed } from "discord.js";

export class ApplicationQuestionsEmbed extends RichEmbed {
    constructor(array: [string, string][], guildColor: string) {
        super();

        this.setColor(guildColor);

        for (let question of array) {
            this.addField(question[0], (question[1] || "Error saving message."));
        }

        this.setTimestamp();
    }
}