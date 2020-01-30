import { Client, GuildMember, Message, TextChannel, RichEmbed, MessageCollector, User, Collection } from 'discord.js';
import { AbortCharterEmbed } from './Embeds/abort-charter.embed';
import { AbortEmbed } from './Embeds/abort.embed';
import { ApplicationStartEmbed } from './Embeds/application-start.embed';
import { IntroEmbed } from './Embeds/intro.embed';
import { TimeoutEmbed } from './Embeds/timeout.embed';
import { ApplicationState } from './Models/ApplicationState';
import { QuestionEmbed } from './Embeds/question.embed';
import { ThanksForApplyingEmbed } from './Embeds/thanks-for-applying.embed';
import { ApplicationEmbed } from './Embeds/application.embed';
import { AlreadyAppliedEmbed } from './Embeds/already-applied.embed';
import { VoteEmbed } from './Embeds/vote.embed';
import { setTimeout } from 'timers';
import { ApplicationAcceptedEmbed } from './Embeds/application-accepted.embed';
import { ApplicationDeniedEmbed } from './Embeds/application-denied.embed';
import { LastQuestionEmbed } from './Embeds/last-question.embed';
import { ArchivedApplicationEmbed } from './Embeds/archived-application.embed';
import { MessagesHelper } from './Helpers/messages.helper';
import * as fs from 'fs';
import { CommunityOptionEmbed } from './Embeds/community-option.embed';
import { CommunityOptionAcceptEmbed } from './Embeds/community-option-accept.embed';
import { CommunityOptionDenyEmbed } from './Embeds/community-option-deny.embed';
import { CommunityOptionTimeoutEmbed } from './Embeds/community-option-timeout.embed';
import { BackupApplicationEmbed } from './Embeds/backup-application.embed';
import { ReserveOptionAcceptEmbed } from './Embeds/reserve-option-accept.embed';
import { ReserveOptionDenyEmbed } from './Embeds/reserve-option-deny.embed';
import { ReserveOptionTimeoutEmbed } from './Embeds/reserve-option-timeout.embed';
import { ReserveOptionEmbed } from './Embeds/reserve-option.embed';
import { ApplicationLogEmbed } from './Embeds/application-log.embed';

export class ApplicationBot {
    private _client = new Client();

    private _applyChannel: TextChannel;
    private _applicationsNewChannel: TextChannel;
    private _applicationsLogChannel: TextChannel;
    private _applicationsArchivedChannel: TextChannel;
    private _activeApplications: Map<string, ApplicationState>;

    private _leadership: GuildMember[];
    private _appSettings;
    private _messages: MessagesHelper = new MessagesHelper();
    private _guildMembers: GuildMember[];

    public start(appSettings): void {
        this._appSettings = appSettings;

        this._client.login(this._appSettings['token']);

        this._client.once('ready', () => {
            console.log('Ready!');

            this._applyChannel = this._client.channels.get(this._appSettings['apply']) as TextChannel;
            this._applicationsNewChannel = this._client.channels.get(this._appSettings['applications-new']) as TextChannel;
            this._applicationsLogChannel = this._client.channels.get(this._appSettings['applications-log']) as TextChannel;
            this._applicationsArchivedChannel = this._client.channels.get(this._appSettings['applications-archived']) as TextChannel;
        });

        this._client.on('message', message => {
            if (message.content === '/apply') {
                if (message.channel.id === this._applyChannel.id) {
                    this._leadership = this._client.guilds.get(this._appSettings['server']).members.array().filter((member) => member.roles.filter((role) => role.id === this._appSettings['leadership']).array().length > 0);

                    if (!this._activeApplications) {
                        this._activeApplications = new Map<string, ApplicationState>();
                    }

                    if (!this._activeApplications.get(message.author.id)) {
                        this._activeApplications.set(message.author.id, new ApplicationState());

                        let activeApplication = this._activeApplications.get(message.author.id);

                        message.author.send(new IntroEmbed(this._appSettings['charter'], this._appSettings['schedule'])).then((sentMessage) => {
                            message.react('✅');

                            this.awaitConfirmation(
                                sentMessage as Message,
                                message,
                                this.proceedToApplicationStart.bind(this, message, activeApplication),
                                this.sendEmbed.bind(this, message, new TimeoutEmbed(this._leadership, this._appSettings['apply'])));
                        });

                        this._applicationsLogChannel.send(new ApplicationLogEmbed(message.author.username, 'Application Initiated', 'Sent initial message covering the charter and schedule. Awaiting reply.'));

                    } else {
                        this.sendEmbed(message, new AlreadyAppliedEmbed(this._leadership));

                        this._applicationsLogChannel.send(new ApplicationLogEmbed(message.author.username, 'User May Need Help', 'User sent another /apply when they already had an active application.'));
                    }
                }
            }

            if (message.content === '/test' && message.channel.type === 'dm') {
                message.author.send('Bot running.');
            }

            if (message.content.startsWith('/restore') && message.channel.type === 'dm' && message.author.id === this._appSettings['admin']) {
                let memberId = message.content.match(/"((?:\\.|[^"\\])*)"/)[0].replace(/"/g, '');
                this._guildMembers = this._client.guilds.get(this._appSettings['server']).members.array();
                let fullMember = this.matchMemberFromId(this._guildMembers, memberId);

                if (fullMember) {
                    let path = message.content.replace('/restore', '').replace(memberId, '').replace(/"/g, '').trim();

                    fs.createReadStream(path)
                        .on('data', (data) => {
                            let backup: string[][] = JSON.parse(data);
                            this._applicationsArchivedChannel.send(new BackupApplicationEmbed(backup, fullMember));
                        })
                        .on('error', () => {
                            message.channel.send('File not found.');
                        });
                } else {
                    message.channel.send('Member not found.');
                }

            }
        });
    }

    private proceedToApplicationStart(message: Message, activeApplication: ApplicationState) {
        message.author.send(new ApplicationStartEmbed()).then((sentMessage) => {
            this.awaitConfirmation(
                sentMessage as Message,
                message,
                this.proceedToQuestion.bind(this, 1, message, activeApplication),
                this.sendEmbed.bind(this, message, new TimeoutEmbed(this._leadership, this._appSettings['apply']))
            )
        });

        this._applicationsLogChannel.send(new ApplicationLogEmbed(message.author.username, 'Charter and Schedule Approved', 'Sent "About the Application Process" message and awaiting reply to begin.'));
    }

    private sendEmbed(message: Message, embed: RichEmbed) {
        message.author.send(embed);
    }

    private async proceedToQuestion(questionNumber: number, message: Message, activeApplication: ApplicationState) {
        if (questionNumber === 1) {
            this._applicationsLogChannel.send(new ApplicationLogEmbed(message.author.username, 'Application Begun', 'Sent first question and awaiting reply.'));

        } else {
            await this._applicationsLogChannel.send(new ApplicationLogEmbed(message.author.username, `Received Reply to Question ${questionNumber - 1}`, questions[questionNumber - 1]));
            this._applicationsLogChannel.send(activeApplication.replies[questionNumber - 2].content);
        }

        if (questionNumber !== lastQuestion) {
            message.author.send(new QuestionEmbed(questions[questionNumber], questionNumber)).then((sentMessage) => {
                questionNumber++;

                this.awaitResponse(
                    sentMessage as Message,
                    message,
                    activeApplication,
                    this.proceedToQuestion.bind(this, questionNumber, message, activeApplication),
                    this.sendEmbed.bind(this, message, new TimeoutEmbed(this._leadership, this._appSettings['apply']))
                )
            });

        } else {
            message.author.send(new LastQuestionEmbed()).then((sentMessage) => {
                this.awaitConfirmation(
                    sentMessage as Message,
                    message,
                    this.finalizeApplication.bind(this, message, activeApplication),
                    this.sendEmbed.bind(this, message, new TimeoutEmbed(this._leadership, this._appSettings['apply'])));
            });
        }
    }

    private finalizeApplication(message: Message, activeApplication: ApplicationState): void {
        message.author.send(new ThanksForApplyingEmbed(this._leadership));

        this._applicationsNewChannel.send(new ApplicationEmbed(message, questions, activeApplication)).then((applicationMessage) => {
            (applicationMessage as Message).channel.send(new VoteEmbed(message)).then((voteMessage) => {
                this.awaitMajorityApproval(
                    voteMessage as Message,
                    this.approveApplication.bind(this, applicationMessage, voteMessage, message, activeApplication),
                    this.denyApplication.bind(this, applicationMessage, voteMessage, message, activeApplication),
                    this.sendCommunityMemberOption.bind(this, applicationMessage, voteMessage, message, activeApplication),
                    this.sendReserveMemberOption.bind(this, applicationMessage, voteMessage, message, activeApplication))
            });
        });

        this.backUpValues(activeApplication);

        this._applicationsLogChannel.send(new ApplicationLogEmbed(message.author.username, 'Application Complete', 'Application has been completed and backed up.'));
    } 

    private approveApplication(applicationMessage: Message, voteMessage: Message, userMessage: Message, activeApplication: ApplicationState): void {
        userMessage.author.send(new ApplicationAcceptedEmbed(this._appSettings['charter'], this._appSettings['schedule'], this._appSettings['raidiquette']));
        userMessage.member.addRole(this._appSettings['applicant']);

        applicationMessage.channel.send('Application approved. Archiving in 5 seconds.').then((archiveMessage) => {
            setTimeout(() => {
                (archiveMessage as Message).delete();
                this.archiveApplication(':white_check_mark:', applicationMessage, voteMessage, userMessage, activeApplication);
            }, 5000);
        });
    }

    private denyApplication(applicationMessage: Message, voteMessage: Message, userMessage: Message, activeApplication: ApplicationState): void {
        userMessage.author.send(new ApplicationDeniedEmbed());

        applicationMessage.channel.send('Application denied. Archiving in 5 seconds.').then((archiveMessage) => {
            setTimeout(() => {
                (archiveMessage as Message).delete();
                this.archiveApplication(':x:', applicationMessage, voteMessage, userMessage, activeApplication);
            }, 5000);
        });
    }

    private approveCommunityMember(applicationMessage: Message, voteMessage: Message, userMessage: Message, activeApplication: ApplicationState, confirmationMessage: Message): void {
        userMessage.author.send(new CommunityOptionAcceptEmbed());
        userMessage.member.addRole(this._appSettings['community']);

        applicationMessage.channel.send('Community member option accepted. Archiving in 5 seconds.').then((archiveMessage) => {
            setTimeout(() => {
                (confirmationMessage as Message).delete();
                (archiveMessage as Message).delete();
                this.archiveApplication(':slight_smile: :white_check_mark:', applicationMessage, voteMessage, userMessage, activeApplication);
            }, 5000);
        });
    }

    private denyCommunityMember(applicationMessage: Message, voteMessage: Message, userMessage: Message, activeApplication: ApplicationState, confirmationMessage: Message): void {
        userMessage.author.send(new CommunityOptionDenyEmbed());

        applicationMessage.channel.send('Community member option declined. Archiving in 5 seconds.').then((archiveMessage) => {
            setTimeout(() => {
                (confirmationMessage as Message).delete();
                (archiveMessage as Message).delete();
                this.archiveApplication(':slight_smile: :x:', applicationMessage, voteMessage, userMessage, activeApplication);
            }, 5000);
        });
    }

    private timeoutCommunityMember(applicationMessage: Message, voteMessage: Message, userMessage: Message, activeApplication: ApplicationState, confirmationMessage: Message): void {
        userMessage.author.send(new CommunityOptionTimeoutEmbed());

        applicationMessage.channel.send('Community member option timed out due to inactivity. Archiving in 5 seconds.').then((archiveMessage) => {
            setTimeout(() => {
                (confirmationMessage as Message).delete();
                (archiveMessage as Message).delete();
                this.archiveApplication(':slight_smile: :clock1:', applicationMessage, voteMessage, userMessage, activeApplication);
            }, 5000);
        });
    }

    private async sendCommunityMemberOption(applicationMessage: Message, voteMessage: Message, userMessage: Message, activeApplication: ApplicationState): Promise<void> {
        let confirmationMessage = await applicationMessage.channel.send(`Community member proposal sent to ${userMessage.author.username}. Awaiting reply.`);

        userMessage.author.send(new CommunityOptionEmbed()).then((sentMessage) => {
            this.awaitRoleApproval(
                sentMessage as Message,
                userMessage,
                this.approveCommunityMember.bind(this, applicationMessage, voteMessage, userMessage, activeApplication, confirmationMessage),
                this.denyCommunityMember.bind(this, applicationMessage, voteMessage, userMessage, activeApplication, confirmationMessage),
                this.timeoutCommunityMember.bind(this, applicationMessage, voteMessage, userMessage, activeApplication, confirmationMessage)),
                true
        })
    }

    private approveReserveMember(applicationMessage: Message, voteMessage: Message, userMessage: Message, activeApplication: ApplicationState, confirmationMessage: Message): void {
        userMessage.author.send(new ReserveOptionAcceptEmbed(this._appSettings['charter'], this._appSettings['schedule'], this._appSettings['raidiquette']));
        userMessage.member.addRole(this._appSettings['reserve']);

        applicationMessage.channel.send('Reserve member option accepted. Archiving in 5 seconds.').then((archiveMessage) => {
            setTimeout(() => {
                (confirmationMessage as Message).delete();
                (archiveMessage as Message).delete();
                this.archiveApplication(':muscle: :white_check_mark:', applicationMessage, voteMessage, userMessage, activeApplication);
            }, 5000);
        });
    }

    private denyReserveMember(applicationMessage: Message, voteMessage: Message, userMessage: Message, activeApplication: ApplicationState, confirmationMessage: Message): void {
        userMessage.author.send(new ReserveOptionDenyEmbed());

        applicationMessage.channel.send('Reserve member option declined. Archiving in 5 seconds.').then((archiveMessage) => {
            setTimeout(() => {
                (confirmationMessage as Message).delete();
                (archiveMessage as Message).delete();
                this.archiveApplication(':muscle: :x:', applicationMessage, voteMessage, userMessage, activeApplication);
            }, 5000);
        });
    }

    private timeoutReserveMember(applicationMessage: Message, voteMessage: Message, userMessage: Message, activeApplication: ApplicationState, confirmationMessage: Message): void {
        userMessage.author.send(new ReserveOptionTimeoutEmbed());

        applicationMessage.channel.send('Reserve member option timed out due to inactivity. Archiving in 5 seconds.').then((archiveMessage) => {
            setTimeout(() => {
                (confirmationMessage as Message).delete();
                (archiveMessage as Message).delete();
                this.archiveApplication(':muscle: :clock1:', applicationMessage, voteMessage, userMessage, activeApplication);
            }, 5000);
        });
    }

    private async sendReserveMemberOption(applicationMessage: Message, voteMessage: Message, userMessage: Message, activeApplication: ApplicationState): Promise<void> {
        let confirmationMessage = await applicationMessage.channel.send(`Reserve member proposal sent to ${userMessage.author.username}. Awaiting reply.`);

        userMessage.author.send(new ReserveOptionEmbed()).then((sentMessage) => {
            this.awaitRoleApproval(
                sentMessage as Message,
                userMessage,
                this.approveReserveMember.bind(this, applicationMessage, voteMessage, userMessage, activeApplication, confirmationMessage),
                this.denyReserveMember.bind(this, applicationMessage, voteMessage, userMessage, activeApplication, confirmationMessage),
                this.timeoutReserveMember.bind(this, applicationMessage, voteMessage, userMessage, activeApplication, confirmationMessage)),
                true
        })
    }


    private archiveApplication(reaction: string, applicationMessage: Message, voteMessage: Message, userMessage: Message, activeApplication: ApplicationState): void {
        this._applicationsArchivedChannel.send(new ArchivedApplicationEmbed(reaction, userMessage, questions, activeApplication));
        applicationMessage.delete();
        voteMessage.delete();
        this._activeApplications.delete(userMessage.author.id);
    }

    private awaitRoleApproval(sentMessage: Message, message: Message, proceed, abort, timeout, preserveApplicationState?: boolean): void {
        sentMessage.react('✅').then(() => sentMessage.react('❌'));

        const filter = (reaction, user) => {
            return (reaction.emoji.name === '✅' || reaction.emoji.name === '❌') && user.id === message.author.id;
        };

        sentMessage.awaitReactions(filter, { max: 1, time: 86400000, errors: ['time'] }).then((collected) => {
            if (collected.first().emoji.name === '✅') {
                proceed();
            } else {
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

    private awaitConfirmation(sentMessage: Message, message: Message, proceed, timeout): void {
        sentMessage.react('✅');

        const filter = (reaction, user) => {
            return reaction.emoji.name === '✅' && user.id === message.author.id;
        };

        sentMessage.awaitReactions(filter, { max: 1, time: 1800000, errors: ['time'] }).then((collected) => {
            proceed();
        }).catch((error) => {
            if (error) {
                if (error instanceof Collection) {
                    timeout();
                    this._activeApplications.delete(message.author.id);
                }
            }

            console.log("error in awaitConfirmation:", error);
        });
    }

    private awaitMajorityApproval(sentMessage: Message, approve, deny, community, reserve): void {
        sentMessage.react('✅').then(() => sentMessage.react('❌')).then(() => sentMessage.react('💪')).then(() => sentMessage.react('🙂'));

        const filter = (reaction, user) => {
            return (reaction.emoji.name === '✅' || reaction.emoji.name === '❌' || reaction.emoji.name === '💪' || reaction.emoji.name === '🙂' || reaction.emoji.name === '👍' || reaction.emoji.name === '👎' || reaction.emoji.name === '🙃' || reaction.emoji.name === '🍴') && this._leadership.find((member) => member.id === user.id) != null;
        };

        const collector = (sentMessage as Message).createReactionCollector(filter);
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
        })
    }

    private awaitResponse(sentMessage: Message, message: Message, activeApplication: ApplicationState, proceed, timeout): void {
        const filter = response => {
            return message.author.id === response.author.id;
        };

        sentMessage.channel.awaitMessages(filter, { maxMatches: 1, time: 1800000, errors: ['time'] }).then((collected) => {
            activeApplication.replies.push(Array.from(collected.entries())[0][1]);
            proceed();
        }).catch((error) => {
            if (error) {
                if (error instanceof Collection) {
                    timeout();
                    this._activeApplications.delete(message.author.id);
                }
            }

            console.log("error in awaitResponse:", error);
        });
    }

    private canUseCommands(message: Message): boolean {
        return message.author.id === this._appSettings['admin'];
    }

    public async backUpValues(activeApplication: ApplicationState): Promise<void> {
        let cleanReplies = new Array<[string, string]>();

        for (let i = 0; i < activeApplication.replies.length; i++) {
            cleanReplies.push([questions[i + 1], activeApplication.replies[i].content]);
        }

        let dir = 'backups';

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.createWriteStream(`${dir}/application-${activeApplication.replies[0].author.id}-${this.monthDayYearFormatted}.json`)
            .write(JSON.stringify(cleanReplies));
    }

    public get monthDayYearFormatted(): string {
        return `${new Date().getMonth() + 1}-${new Date().getDate()}-${new Date().getFullYear()}`;
    }

    public matchMemberFromId(members: GuildMember[], memberId: string): GuildMember {
        return members.find((x) => x.id === memberId);
    }

}

export const lastQuestion = 16;

export const questions = {
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
}