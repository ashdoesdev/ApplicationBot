"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const application_bot_1 = require("./application-bot");
const auth = require("../auth.json");
const attendanceBot = new application_bot_1.ApplicationBot();
attendanceBot.start(auth.token);
