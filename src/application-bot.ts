import { Client, GuildMember, Message, TextChannel, RichEmbed, MessageCollector, User } from 'discord.js';
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

export class ApplicationBot {
    private _client = new Client();

    private _applyChannel: TextChannel;
    private _applicationsNewChannel: TextChannel;
    private _applicationsArchivedChannel: TextChannel;
    private _activeApplications: Map<string, ApplicationState>;

    private _leadership: GuildMember[];
    private _appSettings;
    private _messages: MessagesHelper = new MessagesHelper();

    public start(appSettings): void {
        this._appSettings = appSettings;

        this._client.login(this._appSettings['token']);

        this._client.once('ready', () => {
            console.log('Ready!');

            this._applyChannel = this._client.channels.get(this._appSettings['apply']) as TextChannel;
            this._applicationsNewChannel = this._client.channels.get(this._appSettings['applications-new']) as TextChannel;
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

                            this.awaitApproval(
                                sentMessage as Message,
                                message,
                                this.proceedToApplicationStart.bind(this, message, activeApplication),
                                this.sendEmbed.bind(this, message, new AbortCharterEmbed(this._leadership, this._appSettings['apply'])),
                                this.sendEmbed.bind(this, message, new TimeoutEmbed(this._leadership, this._appSettings['apply'])));
                        });
                    } else {
                        this.sendEmbed(message, new AlreadyAppliedEmbed(this._leadership));
                    }
                }
            }

            if (message.content === '/test' && message.channel.type === 'dm') {
                message.author.send('Bot running.');
            }
        });
    }

    private proceedToApplicationStart(message: Message, activeApplication: ApplicationState) {
        message.author.send(new ApplicationStartEmbed()).then((sentMessage) => {
            this.awaitApproval(
                sentMessage as Message, 
                message,
                this.proceedToQuestion.bind(this, 1, message, activeApplication),
                this.sendEmbed.bind(this, message, new AbortEmbed(this._leadership, this._appSettings['apply'])),
                this.sendEmbed.bind(this, message, new TimeoutEmbed(this._leadership, this._appSettings['apply']))
            )
        })
    }

    private sendEmbed(message: Message, embed: RichEmbed) {
        message.author.send(embed);
    }

    private proceedToQuestion(questionNumber: number, message: Message, activeApplication: ApplicationState) {
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
            })
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
                    this.sendCommunityMemberOption.bind(this, applicationMessage, voteMessage, message, activeApplication))
            });
        });

        this.backUpValues(activeApplication);
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

    private approveCommunityMember(applicationMessage: Message, voteMessage: Message, userMessage: Message, activeApplication: ApplicationState): void {
        userMessage.author.send(new CommunityOptionAcceptEmbed());
        userMessage.member.addRole(this._appSettings['community']);

        applicationMessage.channel.send('Community member option approved. Archiving in 5 seconds.').then((archiveMessage) => {
            setTimeout(() => {
                (archiveMessage as Message).delete();
                this.archiveApplication(':heart: :white_check_mark:', applicationMessage, voteMessage, userMessage, activeApplication);
            }, 5000);
        });
    }

    private denyCommunityMember(applicationMessage: Message, voteMessage: Message, userMessage: Message, activeApplication: ApplicationState): void {
        userMessage.author.send(new CommunityOptionDenyEmbed());

        applicationMessage.channel.send('Community member option denied. Archiving in 5 seconds.').then((archiveMessage) => {
            setTimeout(() => {
                (archiveMessage as Message).delete();
                this.archiveApplication(':heart: :x:', applicationMessage, voteMessage, userMessage, activeApplication);
            }, 5000);
        });
    }

    private timeoutCommunityMember(applicationMessage: Message, voteMessage: Message, userMessage: Message, activeApplication: ApplicationState): void {
        userMessage.author.send(new CommunityOptionTimeoutEmbed());

        applicationMessage.channel.send('Community member option denied due to inactivity. Archiving in 5 seconds.').then((archiveMessage) => {
            setTimeout(() => {
                (archiveMessage as Message).delete();
                this.archiveApplication(':heart: :clock1:', applicationMessage, voteMessage, userMessage, activeApplication);
            }, 5000);
        });
    }

    private sendCommunityMemberOption(applicationMessage: Message, voteMessage: Message, userMessage: Message, activeApplication: ApplicationState): void {
        userMessage.author.send(new CommunityOptionEmbed()).then((sentMessage) => {
            this.awaitApproval(
                sentMessage as Message,
                userMessage,
                this.approveCommunityMember.bind(this, applicationMessage, voteMessage, userMessage, activeApplication),
                this.denyCommunityMember.bind(this, applicationMessage, voteMessage, userMessage, activeApplication),
                this.timeoutCommunityMember.bind(this, applicationMessage, voteMessage, userMessage, activeApplication))
        })
    }

    private archiveApplication(reaction: string, applicationMessage: Message, voteMessage: Message, userMessage: Message, activeApplication: ApplicationState): void {
        this._applicationsArchivedChannel.send(new ArchivedApplicationEmbed(reaction, userMessage, questions, activeApplication));
        applicationMessage.delete();
        voteMessage.delete();
        this._activeApplications.delete(userMessage.author.id);
    }

    private awaitApproval(sentMessage: Message, message: Message, proceed, abort, timeout): void {
        sentMessage.react('✅').then(() => sentMessage.react('❌'));

        const filter = (reaction, user) => {
            return (reaction.emoji.name === '✅' || reaction.emoji.name === '❌') && user.id === message.author.id;
        };

        sentMessage.awaitReactions(filter, { max: 1, time: 1800000, errors: ['time'] }).then((collected) => {
            if (collected.first().emoji.name === '✅') {
                proceed();
            } else {
                abort();
                this._activeApplications.delete(message.author.id);
            }
        }).catch(() => {
            timeout();
            this._activeApplications.delete(message.author.id);
        });
    }

    private awaitConfirmation(sentMessage: Message, message: Message, proceed, timeout): void {
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

    private awaitMajorityApproval(sentMessage: Message, approve, deny, community): void {
        sentMessage.react('✅').then(() => sentMessage.react('❌')).then(() => sentMessage.react('❤️'));

        const filter = (reaction, user) => {
            return (reaction.emoji.name === '✅' || reaction.emoji.name === '❌' || reaction.emoji.name === '❤️' || reaction.emoji.name === '👍' || reaction.emoji.name === '👎' || reaction.emoji.name === '💓') && this._leadership.find((member) => member.id === user.id) != null;
        };

        const collector = (sentMessage as Message).createReactionCollector(filter);
        let minToProceed = Math.round(this._leadership.length / 2);
        let approveCount = 0;
        let denyCount = 0;
        let communityCount = 0;

        collector.on('collect', (reaction) => {
            if (reaction.emoji.name === '✅') {
                approveCount++
            }

            if (reaction.emoji.name === '❌') {
                denyCount++
            }

            if (reaction.emoji.name === '❤️') {
                communityCount++
            }

            if (reaction.emoji.name === '👍') {
                approve();
            }
            
            if (reaction.emoji.name === '👎') {
                deny();
            }
                        
            if (reaction.emoji.name === '💓') {
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
        })

        collector.on('remove', (reaction) => {
            if (reaction.emoji.name === '✅') {
                approveCount--
            }

            if (reaction.emoji.name === '❌') {
                denyCount--
            }

            if (reaction.emoji.name === '❤️') {
                communityCount--
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
        }).catch(() => {
            timeout();
            this._activeApplications.delete(message.author.id);
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

        let dir = 'C:/backups';

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.createWriteStream(`${dir}/application-${activeApplication.replies[0].author.id}.json`)
            .write(JSON.stringify(cleanReplies));
    }
}

export const lastQuestion = 14;

export const questions = {
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
}