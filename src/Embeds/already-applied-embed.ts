import { RichEmbed, GuildMember } from "discord.js";
import { LeadershipList } from "../Helpers/leadership-list.helper";

export class AlreadyAppliedEmbed extends RichEmbed {
    private _leadershipList: LeadershipList;

    constructor(leadership: GuildMember[]) {
        super();
        this._leadershipList = new LeadershipList(leadership);

        this.addField('Oops! You already have an active application', 'Thank you for applying. We will reach out to you within a week of your application submission date to discuss next steps.');
        this.addField('If you have any questions, feel free to reach out to any member of our leadership', this._leadershipList.getMentions());
    }
}