const player = require('../../handlers/player');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    name: 'ClearQueue',
    aliases: ['cq'],
    description: 'Clears song queue',
    usage: '',
    examples: [''],
    cooldown: 2.5,
    category: 'music',
    nsfw: false,
    disabled: true,
    //permissions: ''
    execute(message, args){
        const row = new MessageActionRow().addComponents(
			new MessageButton().setCustomId(`clearqueue-${message.author.id}-${this.name}`).setLabel('Yes').setStyle('DANGER'),
			new MessageButton().setCustomId(`cancel-${message.author.id}-${this.name}`).setLabel('No').setStyle('SECONDARY')
		);

        message.channel.send({content: "Are you sure you want to clear the queue?", components: [row]});
    },
    async executeButton(interaction, client){
        if(interaction.customId.startsWith('clearqueue')){
            player.clearQueue();
            await interaction.editReply(
                { 
                    content: 'Queue cleared.', 
                    components: [
                        new MessageActionRow().addComponents(new MessageButton().setCustomId(`cancel-${interaction.user.id}-${this.name}`).setLabel('Dismiss').setStyle('SECONDARY'))
                    ]
                }
            );
        }
    }
}