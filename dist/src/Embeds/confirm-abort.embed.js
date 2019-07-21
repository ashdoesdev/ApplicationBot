"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class ConfirmAbortEmbed extends discord_js_1.RichEmbed {
    constructor() {
        super();
        this.addField('Oops! Did you mean to click that?', 'Choose yes ✅ to continue to **abort** your application. Choose no ❌ if you didn\'nt mean to click no, and it will return to the previous question.');
    }
}
exports.ConfirmAbortEmbed = ConfirmAbortEmbed;
