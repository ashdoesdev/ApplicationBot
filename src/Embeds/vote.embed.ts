import { RichEmbed, Message } from "discord.js";

export class VoteEmbed extends RichEmbed {
    constructor(message: Message) {
        super();

        this.setColor('#60b5bc');
        this.addField(`Vote approve ✅ deny ❌ or community 🙂 below for ${message.member.displayName}'s application`, 'Once a majority vote has been reached, they will be notified and their rank will be updated (if applicable)');
    }
}