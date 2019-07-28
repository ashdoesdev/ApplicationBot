import { RichEmbed } from "discord.js";

export class IntroEmbed extends RichEmbed {
    constructor() {
        super();

        this.setColor('#60b5bc');
        this.setDescription('Hey there! Thanks for your interest in applying to Sharp and Shiny. Before starting, have you read our <#562899440952934403> and does our raid <#562785022059347978> work for you?');
    }
}