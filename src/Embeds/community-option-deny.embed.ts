import { RichEmbed } from "discord.js";

export class CommunityOptionDenyEmbed extends RichEmbed {
    constructor() {
        super();

        this.setColor('#60b5bc');
        this.addField('Best Wishes', 'Thank you again for applying. We are sorry it did not work out right now, and we wish you the best of luck.');
    }
}