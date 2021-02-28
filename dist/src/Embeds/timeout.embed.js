"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const leadership_list_helper_1 = require("../Helpers/leadership-list.helper");
class TimeoutEmbed extends discord_js_1.RichEmbed {
    constructor(leadership, appSettings) {
        super();
        this._leadershipList = new leadership_list_helper_1.LeadershipListHelper(leadership);
        this.setColor(appSettings['guildColor']);
        this.setDescription(`Application process aborted due to inactivity. Feel free to send another /apply in the <#${appSettings['apply']}> channel when you are ready to start again.`);
        this.addField('Questions? Reach out to any member of our leadership.', this._leadershipList.getMentions());
    }
}
exports.TimeoutEmbed = TimeoutEmbed;
