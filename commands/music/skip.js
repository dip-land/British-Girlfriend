const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    name: 'Skip',
    aliases: ['skipsong'],
    description: 'Skips the current song',
    usage: '',
    examples: [''],
    cooldown: 2.5,
    category: 'music',
    nsfw: false,
    disabled: false,
    //permissions: '',
    execute(message, args){
        if(message.member.voice.channel !== null){
            if(message.guild.me.voice.channel !== null){
                require('../../handlers/player').getNextSong();
            }else{
                message.reply('Bot hasn\'t joined the channel, please use the `join` command.')
            }
        }else{
            message.reply(`You have to be in a voice channel first.`);
        }
    }
}
