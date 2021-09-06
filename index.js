const {Client, Collection} = require("discord.js");
const {prefixes} = require("./config.json");
const client = new Client({ intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'GUILD_VOICE_STATES'], ws:{properties:{$browser:'Discord.js'}}})
const {REST} = require('@discordjs/rest');
const {Routes} = require('discord-api-types/v9');
const commands = [];
const cooldowns = new Collection();
client.commands = new Collection(); 
require('dotenv').config(); 
require('os').setPriority(-20);

require("glob")('./commands/**/*.js', function (err, res) {
    res.forEach(async cmd => {
        try{
            const command = require(cmd);
            client.commands.set(command.name.toLowerCase(), command)
            if(command.data !== undefined){commands.push(command.data.toJSON())}
        }catch(err){console.log(err)}
    });
})

client.on('ready', () =>{
    require('./feeds/feed.js').start(client);
    require('./handlers/activity.js').start(client);
    const rest = new REST({ version: '9' }).setToken(process.env.token);
    const clientId = '878306354014593036', guildId = '708032158614159432', guildId_2 = '877197137807540276';
    (async () => {
        try{
            console.log('Started refreshing application (/) commands.');
            await rest.put(Routes.applicationGuildCommands(clientId, guildId), {body:commands});
            await rest.put(Routes.applicationGuildCommands(clientId, guildId_2), {body:commands});
            //await rest.put(Routes.applicationCommands(clientId),{body:commands});
            console.log('Successfully reloaded application (/) commands.');
            console.log(`online`);
        }catch(err){console.log(err)}
    })();
})

client.on('messageCreate', message =>{
    const prefix = prefixes.find(p => message.content.startsWith(p));
    try {require('./handlers/command.js').execute(message, client, cooldowns, prefix)} catch(error){console.error(error)}
});

client.on('interactionCreate', interaction => {
    if(interaction.isButton() || interaction.isSelectMenu()){require('./handlers/buttons').execute(interaction)}
    if(interaction.isCommand()){require('./handlers/slash').execute(interaction, client)}
})

client.login(process.env.token);