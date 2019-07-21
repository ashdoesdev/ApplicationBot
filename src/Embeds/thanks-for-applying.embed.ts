import { RichEmbed, GuildMember } from "discord.js";
import { LeadershipListHelper } from "../Helpers/leadership-list.helper";

export class ThanksForApplyingEmbed extends RichEmbed {
    private _leadershipList: LeadershipListHelper;

    constructor(leadership: GuildMember[]) {
        super();
        this._leadershipList = new LeadershipListHelper(leadership);

        this.setColor('#60b5bc');
        this.addField('Application Successful!', 'Thank you for applying. We will reach out to you within the week to discuss next steps.');
        this.addField('If you have any questions, feel free to reach out to any member of our leadership', this._leadershipList.getMentions());
    }
}