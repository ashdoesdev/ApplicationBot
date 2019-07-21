import { RichEmbed } from "discord.js";

export class ApplicationAcceptedEmbed extends RichEmbed {
    constructor() {
        super();

        this.setColor('#60b5bc');
        this.addField('Application Accepted!', 'We are happy to let you know that your application has been accepted! Your role has been updated to applicant.');
    }
}