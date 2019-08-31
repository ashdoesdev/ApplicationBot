import { RichEmbed, Message } from "discord.js";
import { ApplicationState } from "../Models/ApplicationState";

export class ArchivedApplicationEmbed extends RichEmbed {
    constructor(reaction: string, message: Message, questions: object, activeApplication: ApplicationState) {
        super();

        this.setColor('#60b5bc');
        this.setTitle(`Application for ${message.member.displayName} ${reaction}`);

        let reactionMessage;

        if (reaction === ':x:') {
            reactionMessage = '**Status:** Application for raider denied';
        } else if (reaction === ':white_check_mark:') {
            reactionMessage = '**Status:** Application for raider accepted';
        } else if (reaction === ':slight_smile: :white_check_mark:') {
            reactionMessage = '**Status:** Offered community member position and accepted';
        } else if (reaction === ':slight_smile: :x:') {
            reactionMessage = '**Status:** Offered community member position but denied';
        } else if (reaction === ':slight_smile: :clock1:') {
            reactionMessage = '**Status:** Offered community member position but offer timed out';
        } else {
            reactionMessage = '**Status:** Unknown';
        }

        this.setDescription(reactionMessage);

        this.setTimestamp();

        for (let i = 0; i < activeApplication.replies.length; i++) {
            this.addField(questions[i + 1], activeApplication.replies[i]);
        }
    }
}