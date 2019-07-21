import { RichEmbed, GuildMember } from "discord.js";
import { LeadershipListHelper } from "../Helpers/leadership-list.helper";

export class TimeoutEmbed extends RichEmbed {
    private _leadershipList: LeadershipListHelper;

    constructor(leadership: GuildMember[]) {
        super();
        this._leadershipList = new LeadershipListHelper(leadership);

        this.setColor('#60b5bc');
        this.setDescription('Application process aborted due to 30 minutes of inactivity. Feel free to send another /apply in the apply channel when you are ready to start again.')
        this.addField('Questions? Reach out to any member of our leadership', this._leadershipList.getMentions());
    }
}