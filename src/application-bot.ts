import { Client, GuildMember, Message, TextChannel, RichEmbed, MessageCollector } from 'discord.js';
import { AbortCharterEmbed } from './Embeds/abort-charter-embed';
import { AbortEmbed } from './Embeds/abort-embed';
import { ApplicationStartEmbed } from './Embeds/application-start-embed';
import { IntroEmbed } from './Embeds/intro-embed';
import { TimeoutEmbed } from './Embeds/timeout-embed';
import { ApplicationState } from './Models/ApplicationState';
import { QuestionEmbed } from './Embeds/question-embed';
import { ThanksForApplyingEmbed } from './Embeds/thanks-for-applying-embed';
import { ApplicationEmbed } from './Embeds/application-embed';

export class ApplicationBot {
    private _client = new Client();

    private _applyChannel: TextChannel;
    private _applicationsNewChannel: TextChannel;
    private _applicationsArchivedChannel: TextChannel;
    private _activeApplications: Map<string, ApplicationState>;

    private _leadership: GuildMember[];

    public start(token: string): void {
        this._client.login(token);

        this._client.once('ready', () => {
            console.log('Ready!');

            this._applyChannel = this._client.channels.get('602200037770133508') as TextChannel;
            this._applicationsNewChannel = this._client.channels.get('602200276824490016') as TextChannel;
            this._applicationsArchivedChannel = this._client.channels.get('602200307489046558') as TextChannel;
        });

        this._client.on('message', message => {
            if (message.content === '/apply') {
                if (message.channel.id === this._applyChannel.id) {
                    if (!this._activeApplications) {
                        this._activeApplications = new Map<string, ApplicationState>();
                    }

                    if (!this._activeApplications.get(message.author.id)) {
                        this._activeApplications.set(message.author.id, new ApplicationState());
                    }

                    let activeApplication = this._activeApplications.get(message.author.id);

                    this._leadership = this._client.guilds.get('602194279854505985').members.array().filter((member) => member.roles.filter((role) => role.name === 'Leadership').array().length > 0);

                    activeApplication.progress = message.author.send(new IntroEmbed()).then((sentMessage) => {
                        this.awaitApproval(
                            sentMessage as Message,
                            message,
                            this.proceedToApplicationStart.bind(this, message, activeApplication),
                            this.sendEmbed.bind(this, message, new AbortCharterEmbed(this._leadership)),
                            this.sendEmbed.bind(this, message, new TimeoutEmbed(this._leadership)));
                    });

                }
            }
        });
    }

    private proceedToApplicationStart(message: Message, activeApplication: ApplicationState) {
        activeApplication.progress = message.author.send(new ApplicationStartEmbed()).then((sentMessage) => {
            this.awaitApproval(
                sentMessage as Message, 
                message,
                this.proceedToQuestion.bind(this, 1, message, activeApplication),
                this.sendEmbed.bind(this, message, new AbortEmbed(this._leadership)),
                this.sendEmbed.bind(this, message, new TimeoutEmbed(this._leadership))
            )
        })
    }

    private sendEmbed(message: Message, embed: RichEmbed) {
        message.author.send(embed);
    }

    private proceedToQuestion(questionNumber: number, message: Message, activeApplication: ApplicationState) {
        if (questionNumber !== lastQuestion) {
            activeApplication.progress = message.author.send(new QuestionEmbed(questions[questionNumber], questionNumber)).then((sentMessage) => {
                questionNumber++;

                this.awaitResponse(
                    sentMessage as Message,
                    message,
                    activeApplication,
                    this.proceedToQuestion.bind(this, questionNumber, message, activeApplication),
                    this.sendEmbed.bind(this, message, new TimeoutEmbed(this._leadership))
                )
            })
        } else {
            activeApplication.progress = message.author.send('That\'s all! Check yes to confirm you wish to apply and to submit your application.').then((sentMessage) => {
                this.awaitApproval(
                    sentMessage as Message,
                    message,
                    this.finalizeApplication.bind(this, message, activeApplication),
                    this.sendEmbed.bind(this, message, new AbortEmbed(this._leadership)),
                    this.sendEmbed.bind(this, message, new TimeoutEmbed(this._leadership)));
            });
        }
    }

    private finalizeApplication(message: Message, activeApplication: ApplicationState): void {
        message.author.send(new ThanksForApplyingEmbed(this._leadership));

        this._applicationsNewChannel.send(new ApplicationEmbed(message, questions, activeApplication));

        this._activeApplications.delete(message.author.id);
    } 

    private awaitApproval(sentMessage: Message, message: Message, proceed, abort, timeout): void {
        (sentMessage as Message).react('✅').then(() => (sentMessage as Message).react('❌'));

        const filter = (reaction, user) => {
            return (reaction.emoji.name === '✅' || reaction.emoji.name === '❌') && user.id === message.author.id;
        };

        (sentMessage as Message).awaitReactions(filter, { max: 1, time: 1800000, errors: ['time'] }).then((collected) => {
            if (collected.first().emoji.name === '✅') {
                proceed();
            } else {
                abort();
            }
        }).catch(() => {
            timeout();
        });
    }

    private awaitResponse(sentMessage: Message, message: Message, activeApplication: ApplicationState, proceed, timeout): void {
        const filter = response => {
            return message.author.id === response.author.id;
        };

        (sentMessage as Message).channel.awaitMessages(filter, { maxMatches: 1, time: 1800000, errors: ['time'] }).then((collected) => {
            activeApplication.replies.push(Array.from(collected.entries())[0][1]);
            proceed();
        }).catch(() => {
            timeout();
        });
    }
}

export const lastQuestion = 13;

export const questions = {
    '1': 'What\'s your in-game name?',
    '2': 'Class?',
    '3': 'Race?',
    '4': 'Professions?',
    '5': 'What spec will you be playing? Link from a [talent calculator](https://classic.wowhead.com/talent-calc)',
    '6': 'How did you hear about Sharp and Shiny, and what made you apply?',
    '7': 'What is your organized raiding experience?',
    '8': 'What do you think is more important for a successful PvE progression guild: attitude or skill? Why?',
    '9': 'When are your usual playtimes? What occupies the bulk of your time in-game? (PvP, PvE, RP, etc.)',
    '10': 'Do you intend to get PvP ranks? (Not required)',
    '11': 'We are rolling on an RP-PvE server, is this in anyway an issue for you? The guild itself is not an RP guild, but we welcome those who wish to',
    '12': 'Calzones or Strombolis?',
}