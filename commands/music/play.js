const player = require('../../handlers/player');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    name: 'Play',
    aliases: ['play'],
    description: 'Plays a song with the given url',
    usage: 'play [String]',
    examples: [''],
    cooldown: 2.5,
    category: 'music',
    nsfw: false,
    disabled: false,
    //permissions: '',
    execute(message, args){
        if(message.member.voice.channel !== null){
            if(message.guild.me.voice.channel === null){
                player.join(message.member.voice.channelId, message.guildId, message.guild.voiceAdapterCreator);
            }
            player.queue(args[0], message);
        }else{
            message.reply(`You have to be in a voice channel first.`);
        }
    }
}
