import { RichEmbed } from "discord.js";

export class IntroEmbed extends RichEmbed {
    constructor(appSettings: any) {
        super();

        this.setColor(appSettings['guildColor']);
        this.setDescription(`Hey there! Thanks for your interest in applying to ${appSettings['guildName']}. Before starting, please confirm you have read these important channels:`);

        let channels = '';

        for (let channel of Object.entries(appSettings['importantReadOnlyChannels'])) {
            channels += `<#${channel[1]}>\n`;
        }

        this.addField('Important channels', channels);

        this.addField('Please Confirm', 'Check yes to continue and confirm that you have read these');
    }
}