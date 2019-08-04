"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const leadership_list_helper_1 = require("../Helpers/leadership-list.helper");
class AbortCharterEmbed extends discord_js_1.RichEmbed {
    constructor(leadership, applyChannel) {
        super();
        this._leadershipList = new leadership_list_helper_1.LeadershipListHelper(leadership);
        this.setColor('#60b5bc');
        this.setDescription(`Please read our charter before applying. Feel free to send another /apply in the <#${applyChannel}> channel when you are ready to begin.`);
        this.addField('Questions? Reach out to any member of our leadership', this._leadershipList.getMentions());
    }
}
exports.AbortCharterEmbed = AbortCharterEmbed;
