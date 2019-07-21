"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const abort_charter_embed_1 = require("./Embeds/abort-charter-embed");
const abort_embed_1 = require("./Embeds/abort-embed");
const application_start_embed_1 = require("./Embeds/application-start-embed");
const intro_embed_1 = require("./Embeds/intro-embed");
const timeout_embed_1 = require("./Embeds/timeout-embed");
const ApplicationState_1 = require("./Models/ApplicationState");
const question_embed_1 = require("./Embeds/question-embed");
const thanks_for_applying_embed_1 = require("./Embeds/thanks-for-applying-embed");
const application_embed_1 = require("./Embeds/application-embed");
class ApplicationBot {
    constructor() {
        this._client = new discord_js_1.Client();
    }
    start(token) {
        this._client.login(token);
        this._client.once('ready', () => {
            console.log('Ready!');
            this._applyChannel = this._client.channels.get('602200037770133508');
            this._applicationsNewChannel = this._client.channels.get('602200276824490016');
            this._applicationsArchivedChannel = this._client.channels.get('602200307489046558');
        });
        this._client.on('message', message => {
            if (message.content === '/apply') {
                if (message.channel.id === this._applyChannel.id) {
                    if (!this._activeApplications) {
                        this._activeApplications = new Map();
                    }
                    if (!this._activeApplications.get(message.author.id)) {
                        this._activeApplications.set(message.author.id, new ApplicationState_1.ApplicationState());
                    }
                    let activeApplication = this._activeApplications.get(message.author.id);
                    this._leadership = this._client.guilds.get('602194279854505985').members.array().filter((member) => member.roles.filter((role) => role.name === 'Leadership').array().length > 0);
                    activeApplication.progress = message.author.send(new intro_embed_1.IntroEmbed()).then((sentMessage) => {
                        this.awaitApproval(sentMessage, message, this.proceedToApplicationStart.bind(this, message, activeApplication), this.sendEmbed.bind(this, message, new abort_charter_embed_1.AbortCharterEmbed(this._leadership)), this.sendEmbed.bind(this, message, new timeout_embed_1.TimeoutEmbed(this._leadership)));
                    });
                }
            }
        });
    }
    proceedToApplicationStart(message, activeApplication) {
        activeApplication.progress = message.author.send(new application_start_embed_1.ApplicationStartEmbed()).then((sentMessage) => {
            this.awaitApproval(sentMessage, message, this.proceedToQuestion.bind(this, 1, message, activeApplication), this.sendEmbed.bind(this, message, new abort_embed_1.AbortEmbed(this._leadership)), this.sendEmbed.bind(this, message, new timeout_embed_1.TimeoutEmbed(this._leadership)));
        });
    }
    sendEmbed(message, embed) {
        message.author.send(embed);
    }
    proceedToQuestion(questionNumber, message, activeApplication) {
        if (questionNumber !== exports.lastQuestion) {
            activeApplication.progress = message.author.send(new question_embed_1.QuestionEmbed(exports.questions[questionNumber], questionNumber)).then((sentMessage) => {
                questionNumber++;
                this.awaitResponse(sentMessage, message, activeApplication, this.proceedToQuestion.bind(this, questionNumber, message, activeApplication), this.sendEmbed.bind(this, message, new timeout_embed_1.TimeoutEmbed(this._leadership)));
            });
        }
        else {
            activeApplication.progress = message.author.send('That\'s all! Check yes to confirm you wish to apply and to submit your application.').then((sentMessage) => {
                this.awaitApproval(sentMessage, message, this.finalizeApplication.bind(this, message, activeApplication), this.sendEmbed.bind(this, message, new abort_embed_1.AbortEmbed(this._leadership)), this.sendEmbed.bind(this, message, new timeout_embed_1.TimeoutEmbed(this._leadership)));
            });
        }
    }
    finalizeApplication(message, activeApplication) {
        message.author.send(new thanks_for_applying_embed_1.ThanksForApplyingEmbed(this._leadership));
        this._applicationsNewChannel.send(new application_embed_1.ApplicationEmbed(message, exports.questions, activeApplication));
    }
    awaitApproval(sentMessage, message, proceed, abort, timeout) {
        sentMessage.react('✅').then(() => sentMessage.react('❌'));
        const filter = (reaction, user) => {
            return (reaction.emoji.name === '✅' || reaction.emoji.name === '❌') && user.id === message.author.id;
        };
        sentMessage.awaitReactions(filter, { max: 1, time: 1800000, errors: ['time'] }).then((collected) => {
            if (collected.first().emoji.name === '✅') {
                proceed();
            }
            else {
                abort();
            }
        }).catch(() => {
            timeout();
        });
    }
    awaitResponse(sentMessage, message, activeApplication, proceed, timeout) {
        const filter = response => {
            return message.author.id === response.author.id;
        };
        sentMessage.channel.awaitMessages(filter, { maxMatches: 1, time: 1800000, errors: ['time'] }).then((collected) => {
            activeApplication.replies.push(Array.from(collected.entries())[0][1]);
            proceed();
        }).catch(() => {
            timeout();
        });
    }
}
exports.ApplicationBot = ApplicationBot;
exports.lastQuestion = 12;
exports.questions = {
    '1': 'What\'s your in-game name?',
    '2': 'Class/race?',
    '3': 'Professions?',
    '4': 'What spec will you be playing? Link from a [talent calculator](https://classic.wowhead.com/talent-calc)',
    '5': 'How did you hear about Sharp and Shiny, and what made you apply?',
    '6': 'What is your organized raiding experience?',
    '7': 'What do you think is more important for a successful PvE progression guild: attitude or skill? Why?',
    '8': 'When are your usual playtimes? What occupies the bulk of your time in-game? (PvP, PvE, RP, etc.)',
    '9': 'Do you intend to get PvP ranks? (Not required)',
    '10': 'We are rolling on an RP-PvE server, is this in anyway an issue for you? The guild itself is not an RP guild, but we welcome those who wish to',
    '11': 'Calzones or Strombolis?',
};
