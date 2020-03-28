"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class BackupApplicationEmbed extends discord_js_1.RichEmbed {
    constructor(questions, member) {
        super();
        this.setColor('#60b5bc');
        if (member instanceof discord_js_1.GuildMember) {
            this.setTitle(`Backup of application for **${member.displayName}**`);
        }
        else {
            this.setTitle(`Backup of application for **${member}**`);
        }
        this.setTimestamp();
        for (let i = 0; i < questions.length; i++) {
            let safeContent = questions[i][1].slice(0, 1024);
            this.addField(questions[i][0], safeContent);
        }
    }
}
exports.BackupApplicationEmbed = BackupApplicationEmbed;
