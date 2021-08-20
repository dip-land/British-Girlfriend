module.exports = {
    async execute(interaction){
		const data = interaction.customId.split('-');
		if(data[1] === interaction.user.id){
			if(interaction.customId.startsWith('cancel') && data[1] === interaction.user.id){interaction.message.delete();}
		} else { interaction.reply({ content: 'Only command initiator has access to this buttons.', ephemeral: true }) }
    }
}