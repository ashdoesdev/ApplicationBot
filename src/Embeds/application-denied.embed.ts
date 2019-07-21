import { RichEmbed } from "discord.js";

export class ApplicationDeniedEmbed extends RichEmbed {
    constructor() {
        super();

        this.setColor('#60b5bc');
        this.addField('Application Denied', 'Please reach out if you have any questions regarding this decision. We wish you the best of luck.');
    }
}