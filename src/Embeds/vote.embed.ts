import { RichEmbed, Message } from "discord.js";

export class VoteEmbed extends RichEmbed {
    constructor(message: Message) {
        super();
        this.addField(`Vote yes ✅ or no ❌ below for ${message.member.displayName}'s application`, 'Once a majority vote has been reached, they will be notified and their rank will be updated (if applicable)');
    }
}