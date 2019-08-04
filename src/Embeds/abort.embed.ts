﻿import { RichEmbed, GuildMember } from "discord.js";
import { LeadershipListHelper } from "../Helpers/leadership-list.helper";

export class AbortEmbed extends RichEmbed {
    private _leadershipList: LeadershipListHelper;

    constructor(leadership: GuildMember[], applyChannel: string) {
        super();
        this._leadershipList = new LeadershipListHelper(leadership);

        this.setColor('#60b5bc');
        this.setDescription(`Application process aborted. Feel free to send another /apply in the <#${applyChannel}> channel when you are ready to begin.`)
        this.addField('Questions? Reach out to any member of our leadership', this._leadershipList.getMentions());
    }
}