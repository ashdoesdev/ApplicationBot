import { RichEmbed } from "discord.js";

export class ApplicationDeniedEmbed extends RichEmbed {
    constructor(appSettings: any) {
        super();

        this.setColor(appSettings['guildColor']);
        this.addField('Application Denied', appSettings['appDeniedMessage']);
    }
}