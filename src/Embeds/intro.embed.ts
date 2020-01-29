import { RichEmbed } from "discord.js";

export class IntroEmbed extends RichEmbed {
    constructor(charterChannel: string, scheduleChannel: string) {
        super();

        this.setColor('#60b5bc');
        this.setDescription(`Hey there! Thanks for your interest in applying to Sharp and Shiny. Before starting, have you read our <#${charterChannel}> and does our raid <#${scheduleChannel}> work for you?`);

        this.addField('Please Confirm', 'Check yes to continue and confirm that you have read our charter and schedule.');
    }
}