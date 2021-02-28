"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class ApplicationQuestionsEmbed extends discord_js_1.RichEmbed {
    constructor(array, guildColor) {
        super();
        this.setColor(guildColor);
        for (let question of array) {
            this.addField(question[0], (question[1] || "Error saving message."));
        }
        this.setTimestamp();
    }
}
exports.ApplicationQuestionsEmbed = ApplicationQuestionsEmbed;
