import { RichEmbed } from "discord.js";

export class ApplicationDeniedEmbed extends RichEmbed {
    constructor() {
        super();

        this.setColor('#60b5bc');
        this.addField('Application Denied',
            `Sorry, but your application to Sharp and Shiny has been declined.\n
            Please check out the Bloodsail Buccaneers server community Discord if you’d like to find other guilds to apply to: https://discord.gg/SZZ369B`);
    }
}