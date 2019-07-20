import { Client, GuildMember, Message, TextChannel, RichEmbed, MessageCollector } from 'discord.js';
import { AbortCharterEmbed } from './Embeds/abort-charter-embed';
import { AbortEmbed } from './Embeds/abort-embed';
import { ApplicationStartEmbed } from './Embeds/application-start-embed';
import { IntroEmbed } from './Embeds/intro-embed';
import { TimeoutEmbed } from './Embeds/timeout-embed';
import { ApplicationState } from './Models/ApplicationState';

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

            this._leadership = this._client.guilds.get('602194279854505985').members.array().filter((member) => member.roles.filter((role) => role.name === 'Leadership').array().length > 0);
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
                this.proceedToQuestion1.bind(this, message, activeApplication),
                this.sendEmbed.bind(this, message, new AbortEmbed(this._leadership)),
                this.sendEmbed.bind(this, message, new TimeoutEmbed(this._leadership))
            )
        })
    }

    private sendEmbed(message: Message, embed: RichEmbed) {
        message.author.send(embed);
    }

    private proceedToQuestion1(message: Message, activeApplication: ApplicationState) {
        activeApplication.progress = message.author.send('This is q1').then((sentMessage) => {
            this.awaitResponse(
                sentMessage as Message,
                message,
                activeApplication,
                this.proceedToQuestion2.bind(this, message, activeApplication),
                this.sendEmbed.bind(this, message, new TimeoutEmbed(this._leadership))
            )
        })
    }
    
    private proceedToQuestion2(message: Message, activeApplication: ApplicationState) {
        activeApplication.progress = message.author.send('This is q2').then((sentMessage) => {
            this.awaitResponse(
                sentMessage as Message,
                message,
                activeApplication,
                this.proceedToQuestion2.bind(this, message, activeApplication),
                this.sendEmbed.bind(this, message, new TimeoutEmbed(this._leadership))
            )
        })
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