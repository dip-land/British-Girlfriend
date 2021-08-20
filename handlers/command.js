const {Collection} = require('discord.js');
const {toHMS} = require('../functions');
module.exports = {
    execute(message, client, cooldowns, prefix) {
        if (prefix === undefined  || message.author.bot) return;
        const args = message.content.slice(prefix.length).trim().split(/ +/), commandName = args.shift().toLowerCase(), 
        command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if(!command) return;
        if(command.nsfw && !message.channel.nsfw) return;
        if(message.author.id !== '439039443744063488'){
            if(command.disabled){return message.reply(`Command is currently disabled, please try agian later.`)}
            if(command.permissions){
                if(!message.member.permissions.has(command.permissions)) return message.reply(`Sorry, but you need to have the permission \`${command.permissions}\``);
            }
            if(!cooldowns.has(command.name)) {cooldowns.set(command.name, new Collection());}
            const now = Date.now(), timestamps = cooldowns.get(command.name), cooldownAmount = (command.cooldown || 2.5) * 1000;
            if(timestamps.has(message.author.id)){
                const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
                if(now < expirationTime){
                    const timeLeft = (expirationTime - now) / 1000;
                    return message.reply(`Please wait \`${toHMS(timeLeft.toFixed(1))}\` before reusing the \`${command.name}\` command.`);
                }
            }
            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        }
        try {
            command.execute(message, args);
        } catch (error) {
            message.reply(`Sorry, but there was an error with that command.\n\`\`\`${error}\`\`\`If error persists please contact shhh#7612.`);
            console.error(error);
        }
    }
}