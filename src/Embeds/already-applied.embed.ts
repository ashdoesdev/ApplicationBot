﻿import { RichEmbed, GuildMember } from "discord.js";
import { LeadershipListHelper } from "../Helpers/leadership-list.helper";

export class AlreadyAppliedEmbed extends RichEmbed {
    private _leadershipList: LeadershipListHelper;

    constructor(leadership: GuildMember[], guildColor: string) {
        super();

        this._leadershipList = new LeadershipListHelper(leadership);

        this.setColor(guildColor);
        this.addField('Oops!', 'You already have an active application.');
        this.addField('If you have any questions, feel free to reach out to any member of our leadership.', this._leadershipList.getMentions());
    }
}