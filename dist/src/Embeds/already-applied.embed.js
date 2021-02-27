"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const leadership_list_helper_1 = require("../Helpers/leadership-list.helper");
class AlreadyAppliedEmbed extends discord_js_1.RichEmbed {
    constructor(leadership) {
        super();
        this._leadershipList = new leadership_list_helper_1.LeadershipListHelper(leadership);
        this.setColor(appSettings['guildColor']);
        this.addField('Oops!', 'You already have an active application.');
        this.addField('If you have any questions, feel free to reach out to any member of our leadership.', this._leadershipList.getMentions());
    }
}
exports.AlreadyAppliedEmbed = AlreadyAppliedEmbed;
