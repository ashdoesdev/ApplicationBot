﻿import { RichEmbed, GuildMember } from "discord.js";
import { LeadershipList } from "../Helpers/leadership-list.helper";

export class AbortCharterEmbed extends RichEmbed {
    private _leadershipList: LeadershipList;

    constructor(leadership: GuildMember[]) {
        super();
        this._leadershipList = new LeadershipList(leadership);
        
        this.setDescription('Please read our charter before applying. Feel free to send another /apply in the apply channel when you are ready to begin.')
        this.addField('Questions? Reach out to any member of our leadership', this._leadershipList.getMentions());
    }
}