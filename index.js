const {Client, Collection} = require("discord.js");
const {prefixes} = require("./config.json");
const client = new Client({ intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS'], ws: { properties: { $browser: 'Discord iOS' }}})
const cooldowns = new Collection();
client.commands = new Collection(); 
require('dotenv').config(); 

require("glob")('./Commands/**/*.js', function (err, res) {
    res.forEach(async cmd => {try{const command = require(`${cmd}`);client.commands.set(command.name.toLowerCase(), command)}catch(err){console.log(err)}});
})

client.on('ready', () =>{
    //require('./feeds/feed.js').start(client);
    require('./handlers/activity.js').start(client);
    console.log(`online`);
})

client.on('messageCreate', message =>{
    const prefix = prefixes.find(p => message.content.startsWith(p));
    try {require('./handlers/command.js').execute(message, client, cooldowns, prefix)} catch(error){console.error(error)}
});

client.on('messageUpdate', message => {
    const newMessage = message.reactions.message, prefix = prefixes.find(p => message.content.startsWith(p));
    newMessage.guild = message.guild; newMessage.createdTimestamp = newMessage.editedTimestamp;
    try {require('./handlers/command.js').execute(newMessage, client, cooldowns, prefix)} catch(error){console.error(error)}
})

client.on('guildMemberAdd', member => {
    //require('./handlers/member.js').join(member);
})

client.on('interactionCreate', interaction => {
    if(interaction.isButton() || interaction.isSelectMenu()){require('./buttons').execute(interaction)}
})

client.login(process.env.token);