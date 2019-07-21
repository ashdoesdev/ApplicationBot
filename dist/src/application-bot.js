"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const abort_charter_embed_1 = require("./Embeds/abort-charter.embed");
const abort_embed_1 = require("./Embeds/abort.embed");
const application_start_embed_1 = require("./Embeds/application-start.embed");
const intro_embed_1 = require("./Embeds/intro.embed");
const timeout_embed_1 = require("./Embeds/timeout.embed");
const ApplicationState_1 = require("./Models/ApplicationState");
const question_embed_1 = require("./Embeds/question.embed");
const thanks_for_applying_embed_1 = require("./Embeds/thanks-for-applying.embed");
const application_embed_1 = require("./Embeds/application.embed");
const already_applied_embed_1 = require("./Embeds/already-applied.embed");
const vote_embed_1 = require("./Embeds/vote.embed");
const timers_1 = require("timers");
const application_accepted_embed_1 = require("./Embeds/application-accepted.embed");
const application_denied_embed_1 = require("./Embeds/application-denied.embed");
const last_question_embed_1 = require("./Embeds/last-question.embed");
const confirm_abort_embed_1 = require("./Embeds/confirm-abort.embed");
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
                    this._leadership = this._client.guilds.get('602194279854505985').members.array().filter((member) => member.roles.filter((role) => role.name === 'Leadership').array().length > 0);
                    if (!this._activeApplications) {
                        this._activeApplications = new Map();
                    }
                    if (!this._activeApplications.get(message.author.id)) {
                        this._activeApplications.set(message.author.id, new ApplicationState_1.ApplicationState());
                    }
                    else {
                        this.sendEmbed(message, new already_applied_embed_1.AlreadyAppliedEmbed(this._leadership));
                    }
                    let activeApplication = this._activeApplications.get(message.author.id);
                    message.author.send(new intro_embed_1.IntroEmbed()).then((sentMessage) => {
                        this.awaitApproval(sentMessage, message, this.proceedToApplicationStart.bind(this, message, activeApplication), this.sendEmbed.bind(this, message, new abort_charter_embed_1.AbortCharterEmbed(this._leadership)), this.sendEmbed.bind(this, message, new timeout_embed_1.TimeoutEmbed(this._leadership)));
                    });
                }
            }
        });
    }
    proceedToApplicationStart(message, activeApplication) {
        message.author.send(new application_start_embed_1.ApplicationStartEmbed()).then((sentMessage) => {
            this.awaitApproval(sentMessage, message, this.proceedToQuestion.bind(this, 1, message, activeApplication), this.sendEmbed.bind(this, message, new abort_embed_1.AbortEmbed(this._leadership)), this.sendEmbed.bind(this, message, new timeout_embed_1.TimeoutEmbed(this._leadership)));
        });
    }
    sendEmbed(message, embed) {
        message.author.send(embed);
    }
    proceedToQuestion(questionNumber, message, activeApplication) {
        if (questionNumber !== exports.lastQuestion) {
            message.author.send(new question_embed_1.QuestionEmbed(exports.questions[questionNumber], questionNumber)).then((sentMessage) => {
                questionNumber++;
                this.awaitResponse(sentMessage, message, activeApplication, this.proceedToQuestion.bind(this, questionNumber, message, activeApplication), this.sendEmbed.bind(this, message, new timeout_embed_1.TimeoutEmbed(this._leadership)));
            });
        }
        else {
            message.author.send(new last_question_embed_1.LastQuestionEmbed()).then((sentMessage) => {
                this.awaitApproval(sentMessage, message, this.finalizeApplication.bind(this, message, activeApplication), this.confirmAbort.bind(this, message, new abort_embed_1.AbortEmbed(this._leadership)), this.sendEmbed.bind(this, message, new timeout_embed_1.TimeoutEmbed(this._leadership)));
            });
        }
    }
    confirmAbort(message, activeApplication) {
        message.author.send(new confirm_abort_embed_1.ConfirmAbortEmbed()).then((sentMessage) => {
            this.awaitApproval(sentMessage, message, this.sendEmbed.bind(this, message, new abort_embed_1.AbortEmbed(this._leadership)), this.finalizeApplication.bind(this, message, activeApplication), this.sendEmbed.bind(this, message, new timeout_embed_1.TimeoutEmbed(this._leadership)));
        });
    }
    finalizeApplication(message, activeApplication) {
        message.author.send(new thanks_for_applying_embed_1.ThanksForApplyingEmbed(this._leadership));
        this._applicationsNewChannel.send(new application_embed_1.ApplicationEmbed(message, exports.questions, activeApplication)).then((applicationMessage) => {
            applicationMessage.channel.send(new vote_embed_1.VoteEmbed(message)).then((voteMessage) => {
                this.awaitMajorityApproval(voteMessage, this.approveApplication.bind(this, applicationMessage, voteMessage, message, activeApplication), this.denyApplication.bind(this, applicationMessage, voteMessage, message, activeApplication));
            });
        });
    }
    approveApplication(applicationMessage, voteMessage, userMessage, activeApplication) {
        userMessage.author.send(new application_accepted_embed_1.ApplicationAcceptedEmbed());
        userMessage.member.addRole('602391083011407903');
        applicationMessage.channel.send('Application approved. Archiving in 5 seconds.').then((archiveMessage) => {
            timers_1.setTimeout(() => {
                archiveMessage.delete();
                this.archiveApplication(applicationMessage, voteMessage, userMessage, activeApplication);
            }, 5000);
        });
    }
    denyApplication(applicationMessage, voteMessage, userMessage, activeApplication) {
        userMessage.author.send(new application_denied_embed_1.ApplicationDeniedEmbed());
        applicationMessage.channel.send('Application denied. Archiving in 5 seconds.').then((archiveMessage) => {
            timers_1.setTimeout(() => {
                archiveMessage.delete();
                this.archiveApplication(applicationMessage, voteMessage, userMessage, activeApplication);
            }, 5000);
        });
    }
    archiveApplication(applicationMessage, voteMessage, userMessage, activeApplication) {
        this._applicationsArchivedChannel.send(new application_embed_1.ApplicationEmbed(userMessage, exports.questions, activeApplication));
        applicationMessage.delete();
        voteMessage.delete();
        this._activeApplications.delete(userMessage.author.id);
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
                this._activeApplications.delete(message.author.id);
            }
        }).catch(() => {
            timeout();
            this._activeApplications.delete(message.author.id);
        });
    }
    awaitMajorityApproval(sentMessage, approve, deny) {
        sentMessage.react('✅').then(() => sentMessage.react('❌'));
        const filter = (reaction, user) => {
            return (reaction.emoji.name === '✅' || reaction.emoji.name === '❌');
        };
        const collector = sentMessage.createReactionCollector(filter);
        let minToProceed = Math.round(this._leadership.length / 2) + 1;
        let approveCount = 0;
        let denyCount = 0;
        collector.on('collect', (reaction) => {
            reaction.emoji.name === '✅' ? approveCount++ : denyCount++;
            if (approveCount === minToProceed) {
                approve();
            }
            if (denyCount === minToProceed) {
                deny();
            }
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
            this._activeApplications.delete(message.author.id);
        });
    }
}
exports.ApplicationBot = ApplicationBot;
exports.lastQuestion = 14;
exports.questions = {
    '1': 'What\'s your in-game name?',
    '2': 'Class?',
    '3': 'Race?',
    '4': 'Professions?',
    '5': 'What spec will you be playing? Link from a talent calculator (https://classic.wowhead.com/talent-calc)',
    '6': 'How did you hear about Sharp and Shiny, and what made you apply?',
    '7': 'How extensive is your organized raiding experience? The more details the better',
    '8': 'What do you think is more important for a successful PvE progression guild: attitude or skill? Why?',
    '9': 'When are your usual playtimes? What occupies the bulk of your time in-game? (PvP, PvE, RP, etc.)',
    '10': 'Do you intend to get PvP ranks? (not required)',
    '11': 'We are rolling on an RP-PvE server, is this in anyway an issue for you? The guild itself is not an RP guild, but we welcome those who wish to',
    '12': 'Do you have a referral or know anyone in the guild?',
    '13': 'Calzones or strombolis?'
};
