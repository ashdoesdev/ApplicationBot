"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const abort_charter_embed_1 = require("./Embeds/abort-charter-embed");
const abort_embed_1 = require("./Embeds/abort-embed");
const application_start_embed_1 = require("./Embeds/application-start-embed");
const intro_embed_1 = require("./Embeds/intro-embed");
const timeout_embed_1 = require("./Embeds/timeout-embed");
const ApplicationState_1 = require("./Models/ApplicationState");
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
            this._leadership = this._client.guilds.get('602194279854505985').members.array().filter((member) => member.roles.filter((role) => role.name === 'Leadership').array().length > 0);
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
                    activeApplication.progress = message.author.send(new intro_embed_1.IntroEmbed()).then((sentMessage) => {
                        this.awaitApproval(sentMessage, message, this.proceedToApplicationStart.bind(this, message, activeApplication), this.sendEmbed.bind(this, message, new abort_charter_embed_1.AbortCharterEmbed(this._leadership)), this.sendEmbed.bind(this, message, new timeout_embed_1.TimeoutEmbed(this._leadership)));
                    });
                }
            }
        });
    }
    proceedToApplicationStart(message, activeApplication) {
        activeApplication.progress = message.author.send(new application_start_embed_1.ApplicationStartEmbed(this._leadership)).then((sentMessage) => {
            this.awaitApproval(sentMessage, message, this.proceedToQuestion1.bind(this, message, activeApplication), this.sendEmbed.bind(this, message, new abort_embed_1.AbortEmbed(this._leadership)), this.sendEmbed.bind(this, message, new timeout_embed_1.TimeoutEmbed(this._leadership)));
        });
    }
    sendEmbed(message, embed) {
        message.author.send(embed);
    }
    proceedToQuestion1(message, activeApplication) {
        activeApplication.progress = message.author.send('This is q1').then((sentMessage) => {
            this.awaitResponse(sentMessage, message, activeApplication, this.proceedToQuestion2.bind(this, message, activeApplication), this.sendEmbed.bind(this, message, new timeout_embed_1.TimeoutEmbed(this._leadership)));
        });
    }
    proceedToQuestion2(message, activeApplication) {
        activeApplication.progress = message.author.send('This is q2').then((sentMessage) => {
            this.awaitResponse(sentMessage, message, activeApplication, this.proceedToQuestion2.bind(this, message, activeApplication), this.sendEmbed.bind(this, message, new timeout_embed_1.TimeoutEmbed(this._leadership)));
        });
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
