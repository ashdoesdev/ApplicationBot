import { RichEmbed, GuildMember } from "discord.js";
import { LeadershipListHelper } from "../Helpers/leadership-list.helper";

export class ThanksForApplyingEmbed extends RichEmbed {
    private _leadershipList: LeadershipListHelper;

    constructor(leadership: GuildMember[], openAppChannel: string, guildColor: string) {
        super();

        this._leadershipList = new LeadershipListHelper(leadership);

        this.setColor(guildColor);
        this.addField('Application Successful!', `Thank you for applying. A private channel has been opened up for you to ask any questions and discuss next steps with leadership: <#${openAppChannel}>`);
        this.addField('If you have any issues accessing the channel, please reach out directly to any member of our leadership.', this._leadershipList.getMentions());
    }
}