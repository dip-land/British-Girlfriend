const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
.setName('say')
.setDescription('Replies with your input')
.addStringOption(option => option.setName('input').setDescription('The input to say back').setRequired(true));
module.exports = {
    name: 'Say',
    aliases: ['echo'],
    description: 'Make the bot say whatever you want!',
    usage: 'say [String]',
    examples: ['say You should add shhh#7612!'],
    cooldown: 2.5,
    category: 'utility',
    nsfw: false,
    disabled: false,
    permissions: 'ADMINISTRATOR',
    data,
    execute(message, args){
        let sayMessage = args.join(" ");
        if(!args[0]){message.channel.send('You must give me something to say.')} 
        else{try{message.delete()}catch(error){}message.channel.send(sayMessage)}
    },
    async executeSlash(interaction, client){
        interaction.member.guild.channels.fetch(interaction.channelId).then(async channel => {
            channel.send(interaction.options.getString('input'))
            await interaction.reply({ content: 'Sent Message.', ephemeral: true });
        });
    }
}
