import { RichEmbed } from "discord.js";

export class IntroEmbed extends RichEmbed {
    constructor() {
        super();

        this.setColor('#60b5bc');
        this.setDescription('Hey there! Thanks for your interest in applying to Sharp and Shiny. Before starting, have you read our <#602401649343856642>?');
    }
}