import { RichEmbed, GuildMember } from "discord.js";
import { LeadershipListHelper } from "../Helpers/leadership-list.helper";

export class AbortEmbed extends RichEmbed {
    private _leadershipList: LeadershipListHelper;

    constructor(leadership: GuildMember[], appSettings: any) {
        super();

        this._leadershipList = new LeadershipListHelper(leadership);

        this.setColor(appSettings['guildColor']);
        this.setDescription(`Application process aborted. Feel free to send another /apply in the <#${appSettings['apply']}> channel when you are ready to begin.`);
        this.addField('Questions? Reach out to any member of our leadership.', this._leadershipList.getMentions());
    }
}