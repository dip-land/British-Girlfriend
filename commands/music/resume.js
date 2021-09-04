const player = require('../../handlers/player');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    name: 'Resume',
    aliases: ['unpause'],
    description: 'Resumes paused music',
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
                player.getNowPlaying().then(np => {
                    if(np.url){
                        if(np.player_status === "Playing"){
                            message.reply(`${np.song_information.title} is already playing, ${np.time}/${np.song_information.duration}`)
                        } else {
                            player.resume();
                            message.reply(`Resumed ${np.song_information.title}, ${np.time}/${np.song_information.duration}`)
                        }
                    } else {
                        message.reply(`There was nothing playing, you can play/add sonngs to the queue with the \`play\` command.`)
                    }
                })
            }else{
                message.reply('Bot hasn\'t joined the channel, please use the `join` command.')
            }
        }else{
            message.reply(`You have to be in a voice channel first.`);
        }
    }
}
