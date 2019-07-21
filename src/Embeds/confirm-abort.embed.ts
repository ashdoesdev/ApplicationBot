import { RichEmbed } from "discord.js";

export class ConfirmAbortEmbed extends RichEmbed {
    constructor() {
        super();
        this.addField('Oops! Did you mean to click that?', 'Choose yes ✅ to continue to **abort** your application. Choose no ❌ if you didn\'nt mean to click no, and it will return to the previous question.');
    }
}