"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const leadership_list_helper_1 = require("../Helpers/leadership-list.helper");
class ApplicationClearedEmbed extends discord_js_1.RichEmbed {
    constructor(leadership, applyChannel) {
        super();
        this._leadershipList = new leadership_list_helper_1.LeadershipListHelper(leadership);
        this.setColor('#60b5bc');
        this.addField('Application Cleared', `Feel free to send another /apply in the <#${applyChannel}> channel to try again.`);
        this.addField('If you run into any issues, feel free to reach out to any member of our leadership.', this._leadershipList.getMentions());
    }
}
exports.ApplicationClearedEmbed = ApplicationClearedEmbed;
