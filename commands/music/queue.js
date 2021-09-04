const player = require('../../handlers/player');
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
            player.getQueue.then(queue => {
                if(queue.status === 0){
                    message.reply(`There is nothing in the queue, you can add songs with the \`play\` command.`)
                } else {
                    queue.queue.forEach(item => {
                        
                    });
                }
            })
        }else{
            message.reply('Bot hasn\'t joined the channel, please use the `join` command.')
        }
    }
}
