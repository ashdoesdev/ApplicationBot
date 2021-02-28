"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const leadership_list_helper_1 = require("../Helpers/leadership-list.helper");
class ThanksForApplyingEmbed extends discord_js_1.RichEmbed {
    constructor(leadership, openAppChannel, guildColor) {
        super();
        this._leadershipList = new leadership_list_helper_1.LeadershipListHelper(leadership);
        this.setColor(guildColor);
        this.addField('Application Successful!', `Thank you for applying. A private channel has been opened up for you to ask any questions and discuss next steps with leadership: <#${openAppChannel}>`);
        this.addField('If you have any issues accessing the channel, please reach out directly to any member of our leadership.', this._leadershipList.getMentions());
    }
}
exports.ThanksForApplyingEmbed = ThanksForApplyingEmbed;
