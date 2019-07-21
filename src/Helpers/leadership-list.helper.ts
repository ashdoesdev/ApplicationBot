import { GuildMember } from "discord.js";

export class LeadershipListHelper {
    private _leadership: GuildMember[];

    constructor(leadership: GuildMember[]) {
        this._leadership = leadership;
    }

    public getMentions(): string {
        let mentions = '';

        for (let i = 0; i < this._leadership.length; i++) {
            if (i === this._leadership.length - 1) {
                if (i === 0) {
                    mentions += `<@${this._leadership[i].id}>`;
                }
                else {
                    mentions += `or <@${this._leadership[i].id}>`;
                }
            }
            else {
                mentions += `<@${this._leadership[i].id}>, `;
            }
        }

        return mentions;
    }
}