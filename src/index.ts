import { ApplicationBot } from './application-bot';
import * as appSettings from '../appSettings.dev.json';

const applicationBot = new ApplicationBot();
applicationBot.start(appSettings);
