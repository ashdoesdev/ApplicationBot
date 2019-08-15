"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const archived_application_embed_1 = require("./Embeds/archived-application.embed");
const messages_helper_1 = require("./Helpers/messages.helper");
const fs = require("fs");
const community_option_embed_1 = require("./Embeds/community-option.embed");
const community_option_accept_embed_1 = require("./Embeds/community-option-accept.embed");
const community_option_deny_embed_1 = require("./Embeds/community-option-deny.embed");
const community_option_timeout_embed_1 = require("./Embeds/community-option-timeout.embed");
class ApplicationBot {
    constructor() {
        this._client = new discord_js_1.Client();
        this._messages = new messages_helper_1.MessagesHelper();
    }
    start(appSettings) {
        this._appSettings = appSettings;
        this._client.login(this._appSettings['token']);
        this._client.once('ready', () => {
            console.log('Ready!');
            this._applyChannel = this._client.channels.get(this._appSettings['apply']);
            this._applicationsNewChannel = this._client.channels.get(this._appSettings['applications-new']);
            this._applicationsArchivedChannel = this._client.channels.get(this._appSettings['applications-archived']);
        });
        this._client.on('message', message => {
            if (message.content === '/apply') {
                if (message.channel.id === this._applyChannel.id) {
                    this._leadership = this._client.guilds.get(this._appSettings['server']).members.array().filter((member) => member.roles.filter((role) => role.id === this._appSettings['leadership']).array().length > 0);
                    if (!this._activeApplications) {
                        this._activeApplications = new Map();
                    }
                    if (!this._activeApplications.get(message.author.id)) {
                        this._activeApplications.set(message.author.id, new ApplicationState_1.ApplicationState());
                        let activeApplication = this._activeApplications.get(message.author.id);
                        message.author.send(new intro_embed_1.IntroEmbed(this._appSettings['charter'], this._appSettings['schedule'])).then((sentMessage) => {
                            message.react('✅');
                            this.awaitApproval(sentMessage, message, this.proceedToApplicationStart.bind(this, message, activeApplication), this.sendEmbed.bind(this, message, new abort_charter_embed_1.AbortCharterEmbed(this._leadership, this._appSettings['apply'])), this.sendEmbed.bind(this, message, new timeout_embed_1.TimeoutEmbed(this._leadership, this._appSettings['apply'])));
                        });
                    }
                    else {
                        this.sendEmbed(message, new already_applied_embed_1.AlreadyAppliedEmbed(this._leadership));
                    }
                }
            }
            if (message.content === '/test' && message.channel.type === 'dm') {
                message.author.send('Bot running.');
            }
        });
    }
    proceedToApplicationStart(message, activeApplication) {
        message.author.send(new application_start_embed_1.ApplicationStartEmbed()).then((sentMessage) => {
            this.awaitApproval(sentMessage, message, this.proceedToQuestion.bind(this, 1, message, activeApplication), this.sendEmbed.bind(this, message, new abort_embed_1.AbortEmbed(this._leadership, this._appSettings['apply'])), this.sendEmbed.bind(this, message, new timeout_embed_1.TimeoutEmbed(this._leadership, this._appSettings['apply'])));
        });
    }
    sendEmbed(message, embed) {
        message.author.send(embed);
    }
    proceedToQuestion(questionNumber, message, activeApplication) {
        if (questionNumber !== exports.lastQuestion) {
            message.author.send(new question_embed_1.QuestionEmbed(exports.questions[questionNumber], questionNumber)).then((sentMessage) => {
                questionNumber++;
                this.awaitResponse(sentMessage, message, activeApplication, this.proceedToQuestion.bind(this, questionNumber, message, activeApplication), this.sendEmbed.bind(this, message, new timeout_embed_1.TimeoutEmbed(this._leadership, this._appSettings['apply'])));
            });
        }
        else {
            message.author.send(new last_question_embed_1.LastQuestionEmbed()).then((sentMessage) => {
                this.awaitConfirmation(sentMessage, message, this.finalizeApplication.bind(this, message, activeApplication), this.sendEmbed.bind(this, message, new timeout_embed_1.TimeoutEmbed(this._leadership, this._appSettings['apply'])));
            });
        }
    }
    finalizeApplication(message, activeApplication) {
        message.author.send(new thanks_for_applying_embed_1.ThanksForApplyingEmbed(this._leadership));
        this._applicationsNewChannel.send(new application_embed_1.ApplicationEmbed(message, exports.questions, activeApplication)).then((applicationMessage) => {
            applicationMessage.channel.send(new vote_embed_1.VoteEmbed(message)).then((voteMessage) => {
                this.awaitMajorityApproval(voteMessage, this.approveApplication.bind(this, applicationMessage, voteMessage, message, activeApplication), this.denyApplication.bind(this, applicationMessage, voteMessage, message, activeApplication), this.sendCommunityMemberOption.bind(this, applicationMessage, voteMessage, message, activeApplication));
            });
        });
        this.backUpValues(activeApplication);
    }
    approveApplication(applicationMessage, voteMessage, userMessage, activeApplication) {
        userMessage.author.send(new application_accepted_embed_1.ApplicationAcceptedEmbed(this._appSettings['charter'], this._appSettings['schedule'], this._appSettings['raidiquette']));
        userMessage.member.addRole(this._appSettings['applicant']);
        applicationMessage.channel.send('Application approved. Archiving in 5 seconds.').then((archiveMessage) => {
            timers_1.setTimeout(() => {
                archiveMessage.delete();
                this.archiveApplication(':white_check_mark:', applicationMessage, voteMessage, userMessage, activeApplication);
            }, 5000);
        });
    }
    denyApplication(applicationMessage, voteMessage, userMessage, activeApplication) {
        userMessage.author.send(new application_denied_embed_1.ApplicationDeniedEmbed());
        applicationMessage.channel.send('Application denied. Archiving in 5 seconds.').then((archiveMessage) => {
            timers_1.setTimeout(() => {
                archiveMessage.delete();
                this.archiveApplication(':x:', applicationMessage, voteMessage, userMessage, activeApplication);
            }, 5000);
        });
    }
    approveCommunityMember(applicationMessage, voteMessage, userMessage, activeApplication) {
        userMessage.author.send(new community_option_accept_embed_1.CommunityOptionAcceptEmbed());
        userMessage.member.addRole(this._appSettings['community']);
        applicationMessage.channel.send('Community member option approved. Archiving in 5 seconds.').then((archiveMessage) => {
            timers_1.setTimeout(() => {
                archiveMessage.delete();
                this.archiveApplication(':slight_smile: :white_check_mark:', applicationMessage, voteMessage, userMessage, activeApplication);
            }, 5000);
        });
    }
    denyCommunityMember(applicationMessage, voteMessage, userMessage, activeApplication) {
        userMessage.author.send(new community_option_deny_embed_1.CommunityOptionDenyEmbed());
        applicationMessage.channel.send('Community member option denied. Archiving in 5 seconds.').then((archiveMessage) => {
            timers_1.setTimeout(() => {
                archiveMessage.delete();
                this.archiveApplication(':slight_smile: :x:', applicationMessage, voteMessage, userMessage, activeApplication);
            }, 5000);
        });
    }
    timeoutCommunityMember(applicationMessage, voteMessage, userMessage, activeApplication) {
        userMessage.author.send(new community_option_timeout_embed_1.CommunityOptionTimeoutEmbed());
        applicationMessage.channel.send('Community member option denied due to inactivity. Archiving in 5 seconds.').then((archiveMessage) => {
            timers_1.setTimeout(() => {
                archiveMessage.delete();
                this.archiveApplication(':slight_smile: :clock1:', applicationMessage, voteMessage, userMessage, activeApplication);
            }, 5000);
        });
    }
    sendCommunityMemberOption(applicationMessage, voteMessage, userMessage, activeApplication) {
        userMessage.author.send(new community_option_embed_1.CommunityOptionEmbed()).then((sentMessage) => {
            this.awaitApproval(sentMessage, userMessage, this.approveCommunityMember.bind(this, applicationMessage, voteMessage, userMessage, activeApplication), this.denyCommunityMember.bind(this, applicationMessage, voteMessage, userMessage, activeApplication), this.timeoutCommunityMember.bind(this, applicationMessage, voteMessage, userMessage, activeApplication));
        });
    }
    archiveApplication(reaction, applicationMessage, voteMessage, userMessage, activeApplication) {
        this._applicationsArchivedChannel.send(new archived_application_embed_1.ArchivedApplicationEmbed(reaction, userMessage, exports.questions, activeApplication));
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
    awaitConfirmation(sentMessage, message, proceed, timeout) {
        sentMessage.react('✅');
        const filter = (reaction, user) => {
            return reaction.emoji.name === '✅' && user.id === message.author.id;
        };
        sentMessage.awaitReactions(filter, { max: 1, time: 1800000, errors: ['time'] }).then((collected) => {
            proceed();
        }).catch(() => {
            timeout();
            this._activeApplications.delete(message.author.id);
        });
    }
    awaitMajorityApproval(sentMessage, approve, deny, community) {
        sentMessage.react('✅').then(() => sentMessage.react('❌')).then(() => sentMessage.react('🙂'));
        const filter = (reaction, user) => {
            return (reaction.emoji.name === '✅' || reaction.emoji.name === '❌' || reaction.emoji.name === '🙂' || reaction.emoji.name === '👍' || reaction.emoji.name === '👎' || reaction.emoji.name === '🙃') && this._leadership.find((member) => member.id === user.id) != null;
        };
        const collector = sentMessage.createReactionCollector(filter);
        let minToProceed = Math.round(this._leadership.length / 2);
        let approveCount = 0;
        let denyCount = 0;
        let communityCount = 0;
        collector.on('collect', (reaction) => {
            if (reaction.emoji.name === '✅') {
                approveCount++;
            }
            if (reaction.emoji.name === '❌') {
                denyCount++;
            }
            if (reaction.emoji.name === '🙂') {
                communityCount++;
            }
            if (reaction.emoji.name === '👍') {
                approve();
            }
            if (reaction.emoji.name === '👎') {
                deny();
            }
            if (reaction.emoji.name === '🙃') {
                community();
            }
            if (approveCount === minToProceed) {
                approve();
            }
            if (denyCount === minToProceed) {
                deny();
            }
            if (communityCount === minToProceed) {
                community();
            }
        });
        collector.on('remove', (reaction) => {
            if (reaction.emoji.name === '✅') {
                approveCount--;
            }
            if (reaction.emoji.name === '❌') {
                denyCount--;
            }
            if (reaction.emoji.name === '❤️') {
                communityCount--;
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
    canUseCommands(message) {
        return message.author.id === this._appSettings['admin'];
    }
    backUpValues(activeApplication) {
        return __awaiter(this, void 0, void 0, function* () {
            let cleanReplies = new Array();
            for (let i = 0; i < activeApplication.replies.length; i++) {
                cleanReplies.push([exports.questions[i + 1], activeApplication.replies[i].content]);
            }
            let dir = 'C:/backups';
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.createWriteStream(`${dir}/application-${activeApplication.replies[0].author.id}-${this.monthDayYearFormatted}.json`)
                .write(JSON.stringify(cleanReplies));
        });
    }
    get monthDayYearFormatted() {
        return `${new Date().getMonth() + 1}-${new Date().getDate()}-${new Date().getFullYear()}`;
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
