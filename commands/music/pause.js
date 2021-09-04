const player = require('../../handlers/player');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    name: 'Pause',
    aliases: ['stop'],
    description: 'Pauses the current playing track',
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
                    if(np.status === 1){
                        if(np.player_status === "Paused"){
                            message.reply(`${np.song_information.title} is already paused, ${np.time}/${np.song_information.duration}`)
                        } else {
                            player.pause();
                            message.reply(`Paused ${np.song_information.title}, ${np.time}/${np.song_information.duration}`)
                        }
                    } else {
                        message.reply(`There is nothing playing, you can play/add songs to the queue with the \`play\` command.`)
                    }
                }).catch(error => {console.log(error)})
            }else{
                message.reply('Bot hasn\'t joined the channel, please use the `join` command.')
            }
        }else{
            message.reply(`You have to be in a voice channel first.`);
        }
    }
}
