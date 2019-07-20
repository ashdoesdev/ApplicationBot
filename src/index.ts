import { ApplicationBot } from './application-bot';
import * as auth from '../auth.json';

const attendanceBot = new ApplicationBot();
attendanceBot.start(auth.token);
