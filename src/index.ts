import { ApplicationBot } from './application-bot';
import * as appSettings from '../appSettings.prod.json';

const attendanceBot = new ApplicationBot();
attendanceBot.start(appSettings);
