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
const backup_application_embed_1 = require("./Embeds/backup-application.embed");
const reserve_option_accept_embed_1 = require("./Embeds/reserve-option-accept.embed");
const reserve_option_deny_embed_1 = require("./Embeds/reserve-option-deny.embed");
const reserve_option_timeout_embed_1 = require("./Embeds/reserve-option-timeout.embed");
const reserve_option_embed_1 = require("./Embeds/reserve-option.embed");
const application_log_embed_1 = require("./Embeds/application-log.embed");
const application_questions_embed_1 = require("./Embeds/application-questions.embed");
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
            this._applicationsLogChannel = this._client.channels.get(this._appSettings['applications-log']);
            this._applicationsArchivedChannel = this._client.channels.get(this._appSettings['applications-archived']);
            this._applicationChatsArchiveChannel = this._client.channels.get(this._appSettings['application-chats-archived']);
        });
        this._client.on('message', (message) => __awaiter(this, void 0, void 0, function* () {
            if (message.content === '/archiveapp' && message.member.roles.has(this._appSettings['leadership']) && message.channel.name.startsWith('application-')) {
                let messages = yield this._messages.getMessages(message.channel);
                messages.reverse();
                let member;
                if (Array.from(messages[0].mentions.users)[0]) {
                    member = Array.from(messages[0].mentions.users)[0][1];
                }
                if (member) {
                    message.channel.overwritePermissions(member, { VIEW_CHANNEL: false });
                }
                for (let message of messages) {
                    yield this._applicationChatsArchiveChannel.send(`*Message from ${message.author.username}*\n${message.content}`);
                    yield message.delete();
                }
                message.channel.delete();
            }
            if (message.content === '/apply') {
                if (message.channel.id === this._applyChannel.id || (message.channel.id === this._applicationsLogChannel.id && message.author.id === this._appSettings['admin'])) {
                    this._leadership = this._client.guilds.get(this._appSettings['server']).members.array().filter((member) => member.roles.filter((role) => role.id === this._appSettings['leadership']).array().length > 0);
                    if (!this._activeApplications) {
                        this._activeApplications = new Map();
                    }
                    if (!this._activeApplications.get(message.author.id)) {
                        this._activeApplications.set(message.author.id, new ApplicationState_1.ApplicationState());
                        let activeApplication = this._activeApplications.get(message.author.id);
                        message.author.send(new intro_embed_1.IntroEmbed(this._appSettings['charter'], this._appSettings['schedule'])).then((sentMessage) => {
                            message.react('✅');
                            this.awaitConfirmation(sentMessage, message, this.proceedToApplicationStart.bind(this, message, activeApplication), this.sendEmbed.bind(this, message, new timeout_embed_1.TimeoutEmbed(this._leadership, this._appSettings['apply'])));
                        });
                        this._applicationsLogChannel.send(new application_log_embed_1.ApplicationLogEmbed(message.author.username, 'Application Initiated', 'Sent initial message covering the charter and schedule. Awaiting reply.'));
                    }
                    else {
                        this.sendEmbed(message, new already_applied_embed_1.AlreadyAppliedEmbed(this._leadership));
                        this._applicationsLogChannel.send(new application_log_embed_1.ApplicationLogEmbed(message.author.username, 'User May Need Help', 'User sent another /apply when they already had an active application.'));
                    }
                }
            }
            if (message.content === '/test' && message.channel.type === 'dm') {
                message.author.send('Bot running.');
            }
            if (message.content.startsWith('/restore') && message.channel.type === 'dm' && message.author.id === this._appSettings['admin']) {
                let memberId = message.content.match(/"((?:\\.|[^"\\])*)"/)[0].replace(/"/g, '');
                this._guildMembers = this._client.guilds.get(this._appSettings['server']).members.array();
                let fullMember = this.matchMemberFromId(this._guildMembers, memberId) || memberId;
                if (fullMember) {
                    let path = message.content.replace('/restore', '').replace(memberId, '').replace(/"/g, '').trim();
                    fs.createReadStream(path)
                        .on('data', (data) => {
                        let backup = JSON.parse(data);
                        this._applicationsArchivedChannel.send(new backup_application_embed_1.BackupApplicationEmbed(backup, fullMember));
                    })
                        .on('error', (error) => {
                        message.channel.send('File not found.');
                    });
                }
                else {
                    message.channel.send('Member not found.');
                }
            }
        }));
    }
    proceedToApplicationStart(message, activeApplication) {
        message.author.send(new application_start_embed_1.ApplicationStartEmbed()).then((sentMessage) => {
            this.awaitConfirmation(sentMessage, message, this.proceedToQuestion.bind(this, 1, message, activeApplication), this.sendEmbed.bind(this, message, new timeout_embed_1.TimeoutEmbed(this._leadership, this._appSettings['apply'])));
        });
        this._applicationsLogChannel.send(new application_log_embed_1.ApplicationLogEmbed(message.author.username, 'Charter and Schedule Approved', 'Sent "About the Application Process" message and awaiting reply to begin.'));
    }
    sendEmbed(message, embed) {
        message.author.send(embed);
        if (embed instanceof timeout_embed_1.TimeoutEmbed) {
            this._applicationsLogChannel.send(new application_log_embed_1.ApplicationLogEmbed(message.author.username, 'Application Timed Out', 'User let their application time out (30 minutes of inactivity). If you suspect this is a bug, let me know and I will check logs.'));
        }
    }
    proceedToQuestion(questionNumber, message, activeApplication) {
        return __awaiter(this, void 0, void 0, function* () {
            if (questionNumber === 1) {
                this._applicationsLogChannel.send(new application_log_embed_1.ApplicationLogEmbed(message.author.username, 'Application Begun', 'Sent first question and awaiting reply.'));
            }
            else {
                yield this._applicationsLogChannel.send(new application_log_embed_1.ApplicationLogEmbed(message.author.username, `Received Reply to Question ${questionNumber - 1}`, exports.questions[questionNumber - 1]));
                this._applicationsLogChannel.send(`*Message received from ${message.author.username}*\n${activeApplication.replies[questionNumber - 2].content}`);
            }
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
        });
    }
    finalizeApplication(message, activeApplication) {
        return __awaiter(this, void 0, void 0, function* () {
            this._applicationsLogChannel.send(new application_log_embed_1.ApplicationLogEmbed(message.author.username, 'Application Submitted', 'User submitted their application.'));
            let appChunked = this.safeChunkApp(exports.questions, activeApplication.replies);
            yield this._applicationsNewChannel.send(new application_embed_1.ApplicationEmbed(message));
            for (let i = 0; i < appChunked.length; i++) {
                let applicationMessage = yield this._applicationsNewChannel.send(new application_questions_embed_1.ApplicationQuestionsEmbed(appChunked[i]));
                if (i + 1 === appChunked.length) {
                    this._applicationsNewChannel.send(new vote_embed_1.VoteEmbed(message)).then((voteMessage) => {
                        this.awaitMajorityApproval(voteMessage, this.approveApplication.bind(this, applicationMessage, voteMessage, message, activeApplication), this.denyApplication.bind(this, applicationMessage, voteMessage, message, activeApplication), this.sendCommunityMemberOption.bind(this, applicationMessage, voteMessage, message, activeApplication), this.sendReserveMemberOption.bind(this, applicationMessage, voteMessage, message, activeApplication));
                    });
                }
            }
            activeApplication.openAppChannel = (yield message.guild.createChannel(`application-${message.author.username}`, 'text'));
            activeApplication.openAppChannel.overwritePermissions(this._appSettings['bot'], { VIEW_CHANNEL: true, MENTION_EVERYONE: true });
            activeApplication.openAppChannel.overwritePermissions(this._appSettings['leadership'], { VIEW_CHANNEL: true });
            activeApplication.openAppChannel.overwritePermissions(message.author.id, { VIEW_CHANNEL: true });
            activeApplication.openAppChannel.overwritePermissions(this._appSettings['everyone'], { VIEW_CHANNEL: false });
            message.author.send(new thanks_for_applying_embed_1.ThanksForApplyingEmbed(this._leadership, activeApplication.openAppChannel.id));
            activeApplication.openAppChannel.send(`<@${message.author.id}> *This is a temporary channel created to discuss your application. It will stay open until your application process is complete. Feel free to ping <@&${this._appSettings['leadership']}> for any questions.*`);
            this.backUpValues(activeApplication);
            this._applicationsLogChannel.send(new application_log_embed_1.ApplicationLogEmbed(message.author.username, 'Backup Complete', 'Post-application steps complete and application backed up.'));
        });
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
    approveCommunityMember(applicationMessage, voteMessage, userMessage, activeApplication, confirmationMessage) {
        userMessage.author.send(new community_option_accept_embed_1.CommunityOptionAcceptEmbed());
        userMessage.member.addRole(this._appSettings['community']);
        applicationMessage.channel.send('Community member option accepted. Archiving in 5 seconds.').then((archiveMessage) => {
            timers_1.setTimeout(() => {
                confirmationMessage.delete();
                archiveMessage.delete();
                this.archiveApplication(':slight_smile: :white_check_mark:', applicationMessage, voteMessage, userMessage, activeApplication);
            }, 5000);
        });
    }
    denyCommunityMember(applicationMessage, voteMessage, userMessage, activeApplication, confirmationMessage) {
        userMessage.author.send(new community_option_deny_embed_1.CommunityOptionDenyEmbed());
        applicationMessage.channel.send('Community member option declined. Archiving in 5 seconds.').then((archiveMessage) => {
            timers_1.setTimeout(() => {
                confirmationMessage.delete();
                archiveMessage.delete();
                this.archiveApplication(':slight_smile: :x:', applicationMessage, voteMessage, userMessage, activeApplication);
            }, 5000);
        });
    }
    timeoutCommunityMember(applicationMessage, voteMessage, userMessage, activeApplication, confirmationMessage) {
        userMessage.author.send(new community_option_timeout_embed_1.CommunityOptionTimeoutEmbed());
        applicationMessage.channel.send('Community member option timed out due to inactivity. Archiving in 5 seconds.').then((archiveMessage) => {
            timers_1.setTimeout(() => {
                confirmationMessage.delete();
                archiveMessage.delete();
                this.archiveApplication(':slight_smile: :clock1:', applicationMessage, voteMessage, userMessage, activeApplication);
            }, 5000);
        });
    }
    sendCommunityMemberOption(applicationMessage, voteMessage, userMessage, activeApplication) {
        return __awaiter(this, void 0, void 0, function* () {
            let confirmationMessage = yield applicationMessage.channel.send(`Community member proposal sent to ${userMessage.author.username}. Awaiting reply.`);
            userMessage.author.send(new community_option_embed_1.CommunityOptionEmbed()).then((sentMessage) => {
                this.awaitRoleApproval(sentMessage, userMessage, this.approveCommunityMember.bind(this, applicationMessage, voteMessage, userMessage, activeApplication, confirmationMessage), this.denyCommunityMember.bind(this, applicationMessage, voteMessage, userMessage, activeApplication, confirmationMessage), this.timeoutCommunityMember.bind(this, applicationMessage, voteMessage, userMessage, activeApplication, confirmationMessage)),
                    true;
            });
        });
    }
    approveReserveMember(applicationMessage, voteMessage, userMessage, activeApplication, confirmationMessage) {
        userMessage.author.send(new reserve_option_accept_embed_1.ReserveOptionAcceptEmbed(this._appSettings['charter'], this._appSettings['schedule'], this._appSettings['raidiquette']));
        userMessage.member.addRole(this._appSettings['reserve']);
        applicationMessage.channel.send('Reserve member option accepted. Archiving in 5 seconds.').then((archiveMessage) => {
            timers_1.setTimeout(() => {
                confirmationMessage.delete();
                archiveMessage.delete();
                this.archiveApplication(':muscle: :white_check_mark:', applicationMessage, voteMessage, userMessage, activeApplication);
            }, 5000);
        });
    }
    denyReserveMember(applicationMessage, voteMessage, userMessage, activeApplication, confirmationMessage) {
        userMessage.author.send(new reserve_option_deny_embed_1.ReserveOptionDenyEmbed());
        applicationMessage.channel.send('Reserve member option declined. Archiving in 5 seconds.').then((archiveMessage) => {
            timers_1.setTimeout(() => {
                confirmationMessage.delete();
                archiveMessage.delete();
                this.archiveApplication(':muscle: :x:', applicationMessage, voteMessage, userMessage, activeApplication);
            }, 5000);
        });
    }
    timeoutReserveMember(applicationMessage, voteMessage, userMessage, activeApplication, confirmationMessage) {
        userMessage.author.send(new reserve_option_timeout_embed_1.ReserveOptionTimeoutEmbed());
        applicationMessage.channel.send('Reserve member option timed out due to inactivity. Archiving in 5 seconds.').then((archiveMessage) => {
            timers_1.setTimeout(() => {
                confirmationMessage.delete();
                archiveMessage.delete();
                this.archiveApplication(':muscle: :clock1:', applicationMessage, voteMessage, userMessage, activeApplication);
            }, 5000);
        });
    }
    sendReserveMemberOption(applicationMessage, voteMessage, userMessage, activeApplication) {
        return __awaiter(this, void 0, void 0, function* () {
            let confirmationMessage = yield applicationMessage.channel.send(`Reserve member proposal sent to ${userMessage.author.username}. Awaiting reply.`);
            userMessage.author.send(new reserve_option_embed_1.ReserveOptionEmbed()).then((sentMessage) => {
                this.awaitRoleApproval(sentMessage, userMessage, this.approveReserveMember.bind(this, applicationMessage, voteMessage, userMessage, activeApplication, confirmationMessage), this.denyReserveMember.bind(this, applicationMessage, voteMessage, userMessage, activeApplication, confirmationMessage), this.timeoutReserveMember.bind(this, applicationMessage, voteMessage, userMessage, activeApplication, confirmationMessage)),
                    true;
            });
        });
    }
    archiveApplication(reaction, applicationMessage, voteMessage, userMessage, activeApplication) {
        return __awaiter(this, void 0, void 0, function* () {
            let appChunked = this.safeChunkApp(exports.questions, activeApplication.replies);
            yield this._applicationsArchivedChannel.send(new archived_application_embed_1.ArchivedApplicationEmbed(reaction, userMessage));
            for (let chunk of appChunked) {
                yield this._applicationsArchivedChannel.send(new application_questions_embed_1.ApplicationQuestionsEmbed(chunk));
            }
            applicationMessage.delete();
            voteMessage.delete();
            this._activeApplications.delete(userMessage.author.id);
        });
    }
    awaitRoleApproval(sentMessage, message, proceed, abort, timeout, preserveApplicationState) {
        sentMessage.react('✅').then(() => sentMessage.react('❌'));
        const filter = (reaction, user) => {
            return (reaction.emoji.name === '✅' || reaction.emoji.name === '❌') && user.id === message.author.id;
        };
        sentMessage.awaitReactions(filter, { max: 1, time: 86400000, errors: ['time'] }).then((collected) => {
            if (collected.first().emoji.name === '✅') {
                proceed();
            }
            else {
                abort();
                this._activeApplications.delete(message.author.id);
            }
        }).catch(() => {
            timeout();
            if (!preserveApplicationState) {
                this._activeApplications.delete(message.author.id);
            }
        });
    }
    awaitConfirmation(sentMessage, message, proceed, timeout) {
        sentMessage.react('✅');
        const filter = (reaction, user) => {
            return reaction.emoji.name === '✅' && user.id === message.author.id;
        };
        sentMessage.awaitReactions(filter, { max: 1, time: 1800000, errors: ['time'] }).then((collected) => {
            proceed();
        }).catch((error) => {
            if (error) {
                if (error instanceof discord_js_1.Collection) {
                    timeout();
                    this._activeApplications.delete(message.author.id);
                }
            }
            console.log("error in awaitConfirmation:", error);
        });
    }
    awaitMajorityApproval(sentMessage, approve, deny, community, reserve) {
        sentMessage.react('✅').then(() => sentMessage.react('❌')).then(() => sentMessage.react('💪')).then(() => sentMessage.react('🙂'));
        const filter = (reaction, user) => {
            return (reaction.emoji.name === '✅' || reaction.emoji.name === '❌' || reaction.emoji.name === '💪' || reaction.emoji.name === '🙂' || reaction.emoji.name === '👍' || reaction.emoji.name === '👎' || reaction.emoji.name === '🙃' || reaction.emoji.name === '🍴') && this._leadership.find((member) => member.id === user.id) != null;
        };
        const collector = sentMessage.createReactionCollector(filter);
        let minToProceed = Math.round(this._leadership.length / 2) + 1;
        collector.on('collect', (reaction) => {
            if (reaction.emoji.name === '✅' && reaction.users.array().length >= minToProceed) {
                approve();
                collector.stop();
            }
            if (reaction.emoji.name === '❌' && reaction.users.array().length >= minToProceed) {
                deny();
                collector.stop();
            }
            if (reaction.emoji.name === '🙂' && reaction.users.array().length >= minToProceed) {
                community();
                collector.stop();
            }
            if (reaction.emoji.name === '💪' && reaction.users.array().length >= minToProceed) {
                reserve();
                collector.stop();
            }
            if (reaction.emoji.name === '👍') {
                approve();
                collector.stop();
            }
            if (reaction.emoji.name === '👎') {
                deny();
                collector.stop();
            }
            if (reaction.emoji.name === '🙃') {
                community();
                collector.stop();
            }
            if (reaction.emoji.name === '🍴') {
                reserve();
                collector.stop();
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
        }).catch((error) => {
            if (error) {
                if (error instanceof discord_js_1.Collection) {
                    timeout();
                    this._activeApplications.delete(message.author.id);
                }
            }
            console.log("error in awaitResponse:", error);
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
            let dir = 'backups';
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
    matchMemberFromId(members, memberId) {
        return members.find((x) => x.id === memberId);
    }
    safeChunkApp(questions, app) {
        let chunks = new Array();
        for (let i = 0; i < app.length; i++) {
            let safeMessage = app[i].content.match(/.{1,1024}(\s|$)/g);
            for (let mi = 0; mi < safeMessage.length; mi++) {
                if (mi > 0) {
                    chunks.push(["(continued)", safeMessage[mi]]);
                }
                else {
                    chunks.push([questions[i + 1], safeMessage[mi]]);
                }
            }
        }
        let safeChunks = new Array();
        let index = 0;
        let indexCharCount = 0;
        for (let chunk of chunks) {
            if (indexCharCount + (chunk[0] + chunk[1]).length > 6000) {
                indexCharCount = 0;
                index++;
            }
            if (!safeChunks[index]) {
                safeChunks.push(new Array());
            }
            safeChunks[index].push([chunk[0], chunk[1]]);
            indexCharCount += chunk[0].length + chunk[1].length;
        }
        return safeChunks;
    }
}
exports.ApplicationBot = ApplicationBot;
exports.lastQuestion = 16;
exports.questions = {
    '1': 'What\'s your in-game name?',
    '2': 'Class?',
    '3': 'Race?',
    '4': 'Level?',
    '5': 'Professions?',
    '6': 'What spec will you be playing? Link from a talent calculator (https://classic.wowhead.com/talent-calc)',
    '7': 'Are you coming from another guild? If so, which guild and why are you leaving?',
    '8': 'How did you hear about Sharp and Shiny, and what made you apply?',
    '9': 'How extensive is your organized raiding experience? The more details the better',
    '10': 'Do you have parses on warcraftlogs? If so, please provide a link.',
    '11': 'What do you think is more important for a successful PvE progression guild: attitude or skill? Why?',
    '12': 'When are your usual playtimes? What occupies the bulk of your time in-game? (PvP, PvE, RP, etc.)',
    '13': 'We are on an RP-PvE server, but as a guild, we do not participate in RP. Is this in any way an issue?',
    '14': 'Do you have a referral or know anyone in the guild?',
    '15': 'Calzones or strombolis?'
};
