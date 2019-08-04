"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const leadership_list_helper_1 = require("../Helpers/leadership-list.helper");
class LeadershipHelpEmbed extends discord_js_1.RichEmbed {
    constructor(leadership) {
        super();
        this._leadershipList = new leadership_list_helper_1.LeadershipListHelper(leadership);
        this.setColor('#60b5bc');
        this.addField('If you run into any issues, feel free to reach out to any member of our leadership', this._leadershipList.getMentions());
    }
}
exports.LeadershipHelpEmbed = LeadershipHelpEmbed;
