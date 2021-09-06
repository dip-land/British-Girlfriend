const player = require('../../handlers/player');
const { MessageEmbed } = require('discord.js');
const { colors } = require('../../config.json')
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    name: 'NowPlaying',
    aliases: ['np'],
    description: 'Shows info about current song',
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
                    if(npData.status === 0){
                        message.reply(`There is nothing playing, you can add songs with the \`play\` command.`)
                    } else {
                        const np = [];
                        let fT = npData.song_information.duration_seconds - npData.time_seconds;
                        np.push(`[${npData.song_information.title}](${npData.song_information.url}) ${npData.time}/${npData.song_information.duration}`)
                        message.channel.send({embeds: [
                            new MessageEmbed()
                            .setDescription(`**__Now Playing__**\n${np.join('\n')}`)
                            .setFooter(`Requested by ${npData.requested_by.tag}`)
                            .setColor(colors.main)
                        ]})
                    }
            })
        }else{
            message.reply('Bot hasn\'t joined the channel, please use the `join` command.')
        }
    }
}
