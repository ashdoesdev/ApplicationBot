import { RichEmbed, GuildMember } from "discord.js";
import { LeadershipListHelper } from "../Helpers/leadership-list.helper";

export class LeadershipHelpEmbed extends RichEmbed {
    private _leadershipList: LeadershipListHelper;

    constructor(leadership: GuildMember[]) {
        super();
        this._leadershipList = new LeadershipListHelper(leadership);

        this.setColor('#60b5bc');
        this.addField('If you run into any issues, feel free to reach out to any member of our leadership', this._leadershipList.getMentions());
    }
}