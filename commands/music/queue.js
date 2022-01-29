const player = require('../../handlers/player');
const { MessageEmbed } = require('discord.js');
const { colors } = require('../../config.json')
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
        if(message.guild.me.voice.channel !== null){
            player.getNowPlaying().then(npData => {
                player.getQueue().then(queue => {
                    if(npData.status === 0){
                        message.reply(`There is nothing playing and there's nothing in the queue, you can add songs with the \`play\` command.`)
                    } else {
                        const data = [], np = [];
                        let i = 1, fT = parseInt(npData.song_information.duration_seconds) - parseInt(npData.time_seconds), queueNum = 0;
                        np.push(`[${npData.song_information.title}](${npData.song_information.url}) [${npData.time}/${npData.song_information.duration}] | Requested by ${npData.requested_by.tag}`)
                        if(queue.status === 0){
                            data.push("Nothing queued...")
                        } else {
                            queue.queue.forEach(item => {
                                const songInfo = item.song_information;
                                if(i <= 5){
                                    data.push(`• ${i}. [${songInfo.title}](${songInfo.url}) [${songInfo.duration}] | Requested by ${item.requested_by.tag}`)
                                }
                                fT = fT + parseInt(songInfo.duration_seconds);
                                i++;
                            });
                        }
                        try{queueNum = queue.queue.length}catch(error){}
                        message.channel.send({embeds: [
                            new MessageEmbed()
                            .setDescription(`**__Now Playing__**\n${np.join('\n')}\n**__Currently Queued__**\n${data.join('\n')}`)
                            .setFooter(`${queueNum} songs in queue | ${player.toHMS(fT)} left`)
                            .setColor(colors.main)
                        ]})
                    }
                })
            })
        }else{
            message.reply('Bot hasn\'t joined the channel, please use the `join` command.')
        }
    }
}
