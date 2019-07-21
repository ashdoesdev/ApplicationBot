import { RichEmbed, GuildMember } from "discord.js";
import { LeadershipList } from "../Helpers/leadership-list.helper";

export class ThanksForApplyingEmbed extends RichEmbed {
    private _leadershipList: LeadershipList;

    constructor(leadership: GuildMember[]) {
        super();
        this._leadershipList = new LeadershipList(leadership);

        this.addField('Application Successful!', 'Thank you for applying. We will reach out to you within the week to discuss next steps.');
        this.addField('If you have any questions, feel free to reach out to any member of our leadership', this._leadershipList.getMentions());
    }
}