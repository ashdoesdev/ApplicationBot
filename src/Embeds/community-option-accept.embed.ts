import { RichEmbed } from "discord.js";

export class CommunityOptionAcceptEmbed extends RichEmbed {
    constructor() {
        super();

        this.setColor('#60b5bc');
        this.addField('Accepted as Community Member',
            `Welcome to Sharp and Shiny! We are super excited to have you as part of our Community for Classic. 🙂\n
            Please remember to follow our code of conduct while in the guild and we’ll get along just fine:`);
        this.addField('Respect', 'Members of Sharp and Shiny are expected to show respect towards one another, as well as towards those outside the guild. This includes respecting the fact that we are on an RP server and the people, in-guild or out, that participate. Members will also keep political discussions to a minimum in guild chat - you are more than welcome to discuss privately in tells or your own channel.');
        this.addField('Maturity', 'Members of Sharp and Shiny are expected to maintain a mature attitude, particularly in regards to class nerfs, sitting out during raids, and promotions/demotions. Members should be able to handle constructive criticism — constructively.');
        this.addField('Equal Opportunity', 'Members of Sharp and Shiny will be expected to treat each other without discrimination. Especially on the basis of their sex, race, or age.\n');
        this.addField('If you have any questions or concerns, please feel free to reach out to an officer! This includes being considered to be added to the raid roster.', 'Here are a few other links to get you settled in:');
        this.addField('Sharp and Shiny guild roster:', 'https://tinyurl.com/y2wq4alq');
        this.addField('Our Battle.net guild group:', 'https://us.blizzard.com/invite/YeaNADaIlwB');
        this.addField('The Bloodsail Buccaneers server community Discord:', 'https://discord.gg/SZZ369B');
    }
}