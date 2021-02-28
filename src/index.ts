import { ApplicationBot } from './application-bot';
import * as appSettings from '../appSettings.json';

const applicationBot = new ApplicationBot();
applicationBot.start(appSettings);
