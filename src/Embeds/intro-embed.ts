import { RichEmbed } from "discord.js";

export class IntroEmbed extends RichEmbed {
    constructor() {
        super();
        this.setDescription('Hey there! Thanks for your interest in applying to Sharp and Shiny. The application process will take about 30 minutes. Before starting, have you read our charter?');
        this.addField('Charter', 'link to charter channel');
    }
}