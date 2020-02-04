import { Message, TextChannel } from "discord.js";

export class ApplicationState {
    public replies: Message[] = new Array<Message>();
    public openAppChannel: TextChannel;
}