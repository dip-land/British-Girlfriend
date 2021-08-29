const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    name: 'Queue',
    aliases: ['q'],
    description: 'Shows song queue',
    usage: '',
    examples: [''],
    cooldown: 2.5,
    category: 'music',
    nsfw: false,
    disabled: true,
    //permissions: '',
    execute(message, args){
        if(message.member.voice.channel !== null){
            if(message.guild.me.voice.channel !== null){
                //require('../../handlers/player').getNextSong();
            }else{
                message.reply('Bot hasn\'t joined the channel, please use the `join` command.')
            }
        }else{
            message.reply(`You have to be in a voice channel first.`);
        }
    }
}
