"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class ApplicationAcceptedEmbed extends discord_js_1.RichEmbed {
    constructor(charterChannel, scheduleChannel, raidiquetteChannel) {
        super();
        this.setColor('#60b5bc');
        this.addField('Application Accepted!', `Welcome to Sharp and Shiny! Your application looks great and we’d love to share our Classic experience with you. :)\n
            If you haven’t already, please take a few minutes to read through the <#${charterChannel}>, <#${scheduleChannel}>, and <#${raidiquetteChannel}> channels at the top of our Discord - these outline how the guild will run and what expectations we have of our members.\n
            You’ll notice we have a ton of chat channels for a whole slew of topics, including individual channels for each class. You’ll find most important information, including raid and class guides, pinned in each channel, which is accessed by clicking the pin icon at the top of Discord.\n
            If you have any further questions, please don’t hesitate to reach out to an officer!\n
            Here are a few other links to get you settled in:`);
        this.addField('Sharp and Shiny guild roster:', 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ_6NrVWMM3vPDuDTA_e6JCj7QbokP-pvbbyC_MKZW82S5R6jl4Ox3JomRnoRV5oxvdfsW-0poB_RcS/pubhtml?gid=0&single=true');
        this.addField('Our Battle.net guild group:', 'https://us.blizzard.com/invite/YeaNADaIlwB');
        this.addField('The Bloodsail Buccaneers server community Discord:', 'https://discord.gg/SZZ369B');
    }
}
exports.ApplicationAcceptedEmbed = ApplicationAcceptedEmbed;
