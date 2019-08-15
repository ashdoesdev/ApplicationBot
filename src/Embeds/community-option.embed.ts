import { RichEmbed } from "discord.js";

export class CommunityOptionEmbed extends RichEmbed {
    constructor() {
        super();

        this.setColor('#60b5bc');
        this.addField('Community Option Proposal', 'We are unable to accept your application at this time. However, we would love to have you as a community member if you wish to stick around. Check yes below if you wish to accept. Please reach out if you have any questions regarding this decision.');
    }
}