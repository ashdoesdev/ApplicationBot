import { RichEmbed, GuildMember } from "discord.js";
import { LeadershipListHelper } from "../Helpers/leadership-list.helper";

export class AbortCharterEmbed extends RichEmbed {
    private _leadershipList: LeadershipListHelper;

    constructor(leadership: GuildMember[], applyChannel: string) {
        super();
        this._leadershipList = new LeadershipListHelper(leadership);

        this.setColor('#60b5bc');
        this.setDescription(`Please read our charter and ensure our raid times work for you before applying. Feel free to send another /apply in the <#${applyChannel}> channel when you are ready to begin.`)
        this.addField('Questions? Reach out to any member of our leadership', this._leadershipList.getMentions());
    }
}