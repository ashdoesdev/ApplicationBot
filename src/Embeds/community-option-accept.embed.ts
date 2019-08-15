import { RichEmbed } from "discord.js";

export class CommunityOptionAcceptEmbed extends RichEmbed {
    constructor() {
        super();

        this.setColor('#60b5bc');
        this.addField('Welcome!', 'We are happy to have you as a community member. Your role has been updated accordingly.');
    }
}