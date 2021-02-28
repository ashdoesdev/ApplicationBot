"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const application_bot_1 = require("./application-bot");
const appSettings = require("../appSettings.dev.json");
const applicationBot = new application_bot_1.ApplicationBot();
applicationBot.start(appSettings);
