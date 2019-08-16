"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const application_bot_1 = require("./application-bot");
const appSettings = require("../appSettings.prod.json");
const attendanceBot = new application_bot_1.ApplicationBot();
attendanceBot.start(appSettings);
