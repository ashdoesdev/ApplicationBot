"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const leadership_list_helper_1 = require("../Helpers/leadership-list.helper");
class TimeoutEmbed extends discord_js_1.RichEmbed {
    constructor(leadership) {
        super();
        this._leadershipList = new leadership_list_helper_1.LeadershipListHelper(leadership);
        this.setColor('#60b5bc');
        this.setDescription('Application process aborted due to 30 minutes of inactivity. Feel free to send another /apply in the <#602200037770133508> channel when you are ready to start again.');
        this.addField('Questions? Reach out to any member of our leadership', this._leadershipList.getMentions());
    }
}
exports.TimeoutEmbed = TimeoutEmbed;
