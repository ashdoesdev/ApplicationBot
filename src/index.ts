import { ApplicationBot } from './application-bot';
import * as appSettings from '../appSettings.dev.json';

const attendanceBot = new ApplicationBot();
attendanceBot.start(appSettings);
