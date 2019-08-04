import { RichEmbed, GuildMember } from "discord.js";
import { LeadershipListHelper } from "../Helpers/leadership-list.helper";

export class NoApplicationEmbed extends RichEmbed {
    private _leadershipList: LeadershipListHelper;

    constructor(leadership: GuildMember[], applyChannel: string) {
        super();
        this._leadershipList = new LeadershipListHelper(leadership);

        this.setColor('#60b5bc');
        this.addField('No Active Application', `Feel free to send another /apply in the <#${applyChannel}> channel to try again.`);
        this.addField('If you run into any issues, feel free to reach out to any member of our leadership.', this._leadershipList.getMentions());
    }
}