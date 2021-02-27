import { ApplicationBot } from './application-bot';
import * as appSettings from '../appSettings.prod.json';

const applicationBot = new ApplicationBot();
applicationBot.start(appSettings);
