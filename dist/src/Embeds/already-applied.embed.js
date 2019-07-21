"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const leadership_list_helper_1 = require("../Helpers/leadership-list.helper");
class AlreadyAppliedEmbed extends discord_js_1.RichEmbed {
    constructor(leadership) {
        super();
        this._leadershipList = new leadership_list_helper_1.LeadershipListHelper(leadership);
        this.addField('Oops! You already have an active application', 'Thank you for applying. We will reach out to you within a week of your application submission date to discuss next steps.');
        this.addField('If you have any questions, feel free to reach out to any member of our leadership', this._leadershipList.getMentions());
    }
}
exports.AlreadyAppliedEmbed = AlreadyAppliedEmbed;
