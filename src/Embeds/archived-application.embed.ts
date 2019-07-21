import { RichEmbed, Message } from "discord.js";
import { ApplicationState } from "../Models/ApplicationState";

export class ArchivedApplicationEmbed extends RichEmbed {
    constructor(reaction: string, message: Message, questions: object, activeApplication: ApplicationState) {
        super();

        this.setColor('#60b5bc');
        this.setTitle(`Application for ${message.member.displayName} ${reaction}`);
        this.setTimestamp();

        for (let i = 0; i < activeApplication.replies.length; i++) {
            this.addField(questions[i + 1], activeApplication.replies[i]);
        }
    }
}