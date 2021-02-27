import { RichEmbed } from "discord.js";

export class ApplicationDeniedEmbed extends RichEmbed {
    constructor(appSettings: any) {
        super();

        this.setColor(appSettings['guildColor']);
        this.addField('Application Denied',
            `Sorry, but your application to Sharp and Shiny has been declined.\n
            ${appSettings['applicationDeniedAdditionalMessage']}`);
    }
}