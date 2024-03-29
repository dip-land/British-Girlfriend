const player = require('../../handlers/player');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    name: 'Join',
    aliases: ['summon'],
    description: 'Summons the bot to the voice channel you are in',
    usage: '',
    examples: [''],
    cooldown: 20,
    category: 'music',
    nsfw: false,
    disabled: false,
    //permissions: '',
    execute(message, args){
        if(message.member.voice.channel !== null){
            if(message.guild.me.voice.channel === null){
                message.reply(`Joining <#${message.member.voice.channel.id}>...`).then(msg => {
                    player.join(message.member.voice.channelId, message.guildId, message.guild.voiceAdapterCreator);
                    msg.edit(`Joined <#${message.member.voice.channel.id}>.`)
                })
            }else{
                message.reply('Bot is already in a channel.')
            }
        }else{
            message.reply(`You have to be in a voice channel first.`);
        }
    }
}
