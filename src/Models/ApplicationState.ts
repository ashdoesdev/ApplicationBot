import { Message } from "discord.js";

export class ApplicationState {
    public progress: Promise<void>;
    public replies: Message[] = new Array<Message>();
}