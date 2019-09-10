import { RichEmbed } from "discord.js";

export class ReserveOptionEmbed extends RichEmbed {
    constructor() {
        super();

        this.setColor('#60b5bc');
        this.addField('Reserve Member Proposal', 'We\'re unable to accept your app for a raid position at this time. However, we can slot you as a reserve if desired. Reserve members are prioritized to transition to raider as raid slots become available. Check yes below if you wish to accept. Please reach out if you have any questions.');
    }
}