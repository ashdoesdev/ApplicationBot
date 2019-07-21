"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const leadership_list_helper_1 = require("../Helpers/leadership-list.helper");
class AbortEmbed extends discord_js_1.RichEmbed {
    constructor(leadership) {
        super();
        this._leadershipList = new leadership_list_helper_1.LeadershipListHelper(leadership);
        this.setColor('#60b5bc');
        this.setDescription('Application process aborted. Feel free to send another /apply in the apply channel when you are ready to begin.');
        this.addField('Questions? Reach out to any member of our leadership', this._leadershipList.getMentions());
    }
}
exports.AbortEmbed = AbortEmbed;
