import { RichEmbed, GuildMember } from "discord.js";
import { LeadershipListHelper } from "../Helpers/leadership-list.helper";

export class AbortCharterEmbed extends RichEmbed {
    private _leadershipList: LeadershipListHelper;

    constructor(leadership: GuildMember[]) {
        super();
        this._leadershipList = new LeadershipListHelper(leadership);

        this.setColor('#60b5bc');
        this.setDescription('Please read our charter before applying. Feel free to send another /apply in the <#602200037770133508> channel when you are ready to begin.')
        this.addField('Questions? Reach out to any member of our leadership', this._leadershipList.getMentions());
    }
}