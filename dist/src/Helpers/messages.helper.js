"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class MessagesHelper {
    getMessages(textChannel, entries, lastId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!entries) {
                entries = new Array();
            }
            if (lastId !== 0) {
                let messages = yield this.bundleMessages(textChannel, entries, lastId);
                if (messages[1]) {
                    yield this.getMessages(textChannel, entries, messages[1]);
                }
            }
            return entries;
        });
    }
    safeChunkApp(questions, app) {
        let chunks = new Array();
        for (let i = 0; i < app.length; i++) {
            let safeMessage = app[i].content.match(/.{1,1024}(\s|$)/g);
            if (!safeMessage) {
                chunks.push([questions[i + 1], "Error saving message."]);
            }
            else {
                for (let mi = 0; mi < safeMessage.length; mi++) {
                    if (mi > 0) {
                        chunks.push(["(continued)", safeMessage[mi]]);
                    }
                    else {
                        chunks.push([questions[i + 1], safeMessage[mi]]);
                    }
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
    bundleMessages(textChannel, entries, previousLastId) {
        return __awaiter(this, void 0, void 0, function* () {
            let options;
            if (previousLastId) {
                options = { limit: 100, before: previousLastId };
            }
            else {
                options = { limit: 100 };
            }
            const messages = yield textChannel.fetchMessages(options);
            entries.push(...messages.array());
            let lastId;
            if (messages.last()) {
                lastId = messages.last().id || 0;
            }
            else {
                lastId = 0;
            }
            return [entries, lastId];
        });
    }
}
exports.MessagesHelper = MessagesHelper;
