"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LeadershipListHelper {
    constructor(leadership) {
        this._leadership = leadership;
    }
    getMentions() {
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
exports.LeadershipListHelper = LeadershipListHelper;
