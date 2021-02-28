# ApplicationBot

ApplicationBot is a Discord bot for guilds and other online communities to manage applications.

## Setup

I recommend hosting the bot on a free-tier EC2 instance.

### Part 1. Set up the application and validate it runs locally.
1. Set up application in the [Discord Developer Portal](https://discord.com/developers/applications)
2. Add a bot user to the application. Copy the token. Don't share or commit it. Adjust .gitignore if needed.
3. Invite bot to server. [Recommended permissions](https://discordapi.com/permissions.html#1342516344)
4. Download files and test the bot locally. 
```
npm install
tsc
node dist/src/index.js
```

### Part 2. Run the application on an EC2 instance.

5. Launch instance and save the key pair provided.
6. [Convert .ppk to .pem with PuTTYgen](https://aws.amazon.com/premiumsupport/knowledge-center/convert-pem-file-into-ppk/). 
7. [Connect to EC2 server with WinSCP](https://winscp.net/eng/docs/guide_amazon_ec2) (or any FTP client).

4. Upload files.
5. Install node & package dependencies.

```
$ sudo apt-get update
$ sudo apt-get install nodejs
$ sudo apt-get install npm
$ npm install
```

6. Install [forever](https://www.npmjs.com/package/forever) module `$ sudo npm install forever -g`. I highly suggest reading the logging options and also specifying logging files.

7. Run application `$ forever start index.js`

### EC2 Tips
- *Never have more than one running instance (especially for a long period of time)*
- *Set up billing notifications*
- *Free instances last 1 year before they are not free (on that account)*

## Usage

To customize the bot for your community, a few edits will be needed. 

1. Create your appSettings. Start by copying the appSettings to a new file. Customize the data accordingly. I usually set up appSettings.dev.json and appSettings.prod.json (one with keys for a dev Discord server, another with the "main" server).

2. Create the channels and roles as described in appSettings. *Currently, channel flexibility is limited.*

3. In index.ts, point the app to the appSettings you wish to use. e.g. `import * as appSettings from '../appSettings.prod.json';`

Recompile `tsc`.

## Commands 

`/apply` (in apply channel)

### Admin

`/archiveapp` (in application-NAME channel)

Moves app conversation to archive.

`/test` (to bot in DMs)

Will respond 'Bot running.' if running.

`/restore` (to bot in DMs)

Will manually restore and move an application if votes do not go through due to bot downtime.

```
/restore "Member Name [Application Acceptance Status Here]" application-xxxxxxxxxxxxxxxxxx-1-1-2021.json
```

Application backups are saved automatically to /backups. File may need to be moved before it can be successfully restored (or adjust path accordingly).

## License
[MIT](https://choosealicense.com/licenses/mit/)
