"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class BackupApplicationEmbed extends discord_js_1.RichEmbed {
    constructor(questions, member) {
        super();
        this.setColor('#60b5bc');
        this.setTitle(`Backup of application for **${member.displayName}**`);
        this.setTimestamp();
        for (let i = 0; i < questions.length; i++) {
            this.addField(questions[i][0], questions[i][1]);
        }
    }
}
exports.BackupApplicationEmbed = BackupApplicationEmbed;
