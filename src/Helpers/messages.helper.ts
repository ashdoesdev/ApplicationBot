import { TextChannel, Message } from "discord.js";

export class MessagesHelper {
    public async getMessages(textChannel: TextChannel, entries?: Message[], lastId?: number): Promise<Message[]> {
        if (!entries) {
            entries = new Array<Message>();
        }

        if (lastId !== 0) {
            let messages = await this.bundleMessages(textChannel, entries, lastId);

            if (messages[1]) {
                await this.getMessages(textChannel, entries, messages[1]);
            }
        }

        return entries;
    }

    public safeChunkApp(questions: object, app: Message[]) {
        let chunks = new Array<[string, string]>();

        for (let i = 0; i < app.length; i++) {
            let safeMessage = app[i].content.match(/.{1,1024}(\s|$)/g);

            if (!safeMessage) {
                chunks.push([questions[i + 1], "Error saving message."]);
            } else {
                for (let mi = 0; mi < safeMessage.length; mi++) {
                    if (mi > 0) {
                        chunks.push(["(continued)", safeMessage[mi]]);
                    } else {
                        chunks.push([questions[i + 1], safeMessage[mi]]);
                    }
                }
            }
        }

        let safeChunks = new Array<[string, string][]>();

        let index = 0;
        let indexCharCount = 0;
        for (let chunk of chunks) {
            if (indexCharCount + (chunk[0] + chunk[1]).length > 6000) {
                indexCharCount = 0;
                index++;
            }

            if (!safeChunks[index]) {
                safeChunks.push(new Array<[string, string]>());
            }

            safeChunks[index].push([chunk[0], chunk[1]]);

            indexCharCount += chunk[0].length + chunk[1].length;
        }

        return safeChunks;
    }

    private async bundleMessages(textChannel: TextChannel, entries: Message[], previousLastId?: number): Promise<[Message[], number]> {
        let options;
        if (previousLastId) {
            options = { limit: 100, before: previousLastId };
        } else {
            options = { limit: 100 };
        }
        const messages = await textChannel.fetchMessages(options);
        entries.push(...messages.array());
        let lastId;

        if (messages.last()) {
            lastId = messages.last().id || 0;
        } else {
            lastId = 0;
        }

        return [entries, lastId];
    }
}