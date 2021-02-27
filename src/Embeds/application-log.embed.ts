import { GuildMember, RichEmbed } from "discord.js";

export class ApplicationLogEmbed extends RichEmbed {
    constructor(member: string, field1: string, field2: string, guildColor: string) {
        super();

        this.setColor(guildColor);

        if (member) {
            this.addField(field1, field2);
            this.setFooter(member);
        }
    }
}