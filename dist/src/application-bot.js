"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
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
                    message.author.send('Hey there! Thanks for your interest in applying to Sharp and Shiny. The application process will take about 30 minutes. Before starting, have you read our charter?').then((sentMessage) => {
                        sentMessage.react('✅').then(() => sentMessage.react('❌'));
                        const filter = (reaction, user) => {
                            return (reaction.emoji.name === '✅' || reaction.emoji.name === '❌') && user.id === message.author.id;
                        };
                        sentMessage.awaitReactions(filter, { max: 1, time: 1800000, errors: ['time'] })
                            .then((collected) => {
                            if (collected.first().emoji.name === '✅') {
                                message.author.send('Cool! Thanks for reading it. If you have any questions, feel free to reach out to any member of our leadership at any time. We can now proceed to work on your application. There are 10 questions in total. Please reply as thoroughly as needed, but in one message per question. After receiving a reply to a question, I will immediately move on to the next one. If you make any mistakes, no worries, there will be a space at the end to add on anything you might have left out. Are you ready to begin?').then((sentMessage) => {
                                    sentMessage.react('✅').then(() => sentMessage.react('❌'));
                                    const filter = (reaction, user) => {
                                        return (reaction.emoji.name === '✅' || reaction.emoji.name === '❌') && user.id === message.author.id;
                                    };
                                    sentMessage.awaitReactions(filter, { max: 1, time: 1800000, errors: ['time'] })
                                        .then((collected) => {
                                        if (collected.first().emoji.name === '✅') {
                                            message.author.send('').then((sentMessage) => {
                                            });
                                        }
                                        else {
                                            message.author.send('Okay, no problem! Application process stopped. Feel free to send another /apply in the apply channel when you are ready to begin.');
                                        }
                                    })
                                        .catch(() => {
                                        message.author.send('No reply received after 30 minutes. Application process stopped. Feel free to send another /apply in the apply channel when you are ready to begin.');
                                    });
                                });
                            }
                            else {
                                message.author.send('Please read our charter before applying. Feel free to send another /apply in the apply channel when you are ready to begin.');
                            }
                        })
                            .catch(() => {
                            message.author.send('No reply received after 30 minutes. Application process stopped. Feel free to send another /apply in the apply channel when you are ready to begin.');
                        });
                    });
                }
            }
        });
    }
}
exports.ApplicationBot = ApplicationBot;
