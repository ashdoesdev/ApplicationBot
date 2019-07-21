import { RichEmbed, GuildMember } from "discord.js";

export class TimeoutEmbed extends RichEmbed {
    private _leadershipList: LeadershipList;

    constructor(leadership: GuildMember[]) {
        super();
        this._leadershipList = new LeadershipList(leadership);

        this.setDescription('Application process aborted due to 30 minutes of inactivity. Feel free to send another /apply in the apply channel when you are ready to start again.')
        this.addField('Questions? Reach out to any member of our leadership', this._leadershipList.getMentions());
    }
}