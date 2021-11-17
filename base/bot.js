const { Client, Collection, Intents } = require('discord.js'),
    { readdirSync } = require('fs'),
    dotenv = require('dotenv');

class Bot extends Client{
    constructor() {
        super({
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MEMBERS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
                Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
                Intents.FLAGS.GUILD_PRESENCES
            ]
        });

        dotenv.config();
        this.config = require(`../config.json`);
        // BOT sys
        this.token = process.env.BOT_TOKEN;
        this.commands = new Collection();
        this.cooldowns = new Collection();

    }

    async launch() {
        await this.init();
        await this.login(this.token);
    };

    async init() {
        // Commands loader
        let dir = `${__dirname}/../commands/`
        readdirSync(dir).forEach(dirs => {
            const commands = readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith(".js"));

            for (const file of commands) {
                const getFileName = require(`${dir}/${dirs}/${file}`);
                this.commands.set(getFileName.help.name, getFileName);
                console.log(`Command loaded : ${getFileName.help.name}`);
            }
        });

        // Events loader
        dir = __dirname+"/../events/"
        readdirSync(dir).forEach(dirs => {
            const events = readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith(".js"));

            for (const event of events) {
                const evt = require(`${dir}/${dirs}/${event}`);
                const evtName = event.split(".")[0];
                this.on(evtName, evt.bind(null, this));
                console.log(`Event loaded : ${evtName}`);
            }
        })

    };

}

module.exports = (token) => new Bot(token, {
    disableEveryone: true,
    fetchAllMembers: true,
});
