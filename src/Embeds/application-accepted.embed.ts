import { RichEmbed } from "discord.js";

export class ApplicationAcceptedEmbed extends RichEmbed {
    constructor() {
        super();
        this.addField('Application Accepted!', 'We are happy to let you know that your application has been accepted! Your role has been updated to applicant.');
    }
}