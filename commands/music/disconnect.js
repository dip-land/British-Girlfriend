const player = require('../../handlers/player');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    name: 'Disconnect',
    aliases: ['dc', 'leave', 'dis'],
    description: 'Disconnects the bot from the voice channel it is in',
    usage: '',
    examples: [''],
    cooldown: 20,
    category: 'music',
    nsfw: false,
    disabled: false,
    //permissions: '',
    execute(message, args){
        if(message.member.voice.channel !== null){
            if(message.guild.me.voice.channel !== null){
                message.reply(`Disconnecting from <#${message.member.voice.channel.id}>...`).then(msg => {
                    player.leave(message.guildId);
                    msg.edit(`Successfully disconnected from <#${message.member.voice.channel.id}>.`)
                })
            }else{
                message.reply('Bot hasn\'t joined the channel.')
            }
        }else{
            message.reply(`You must be in the voice channel to make the bot leave.`);
        }
    }
}
