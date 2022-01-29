module.exports = {
    async execute(interaction, client){
		//const integer = interaction.options.getInteger('int');
		//const boolean = interaction.options.getBoolean('choice');
		//const user = interaction.options.getUser('target');
		//const member = interaction.options.getMember('target');
		//const channel = interaction.options.getChannel('destination');
		//const role = interaction.options.getRole('muted');
		//const mentionable = interaction.options.getMentionable('mentionable');
		require("glob")(`c:/projects/discordbots/tbg/commands/**/${interaction.commandName}.js`, function (err, res) {
			res.forEach(async cmd => {
				console.log(`${interaction.user.tag} used ${interaction.commandName}`);
				const command = require(cmd);
				if(command.permissions){
					if(interaction.member.permissions.has(command.permissions)){
						command.executeSlash(interaction, client)
					}else{
						await interaction.reply({ content: 'Hmmm, Looks like you don\'t have the correct permissions to use this command.', ephemeral: true });
					}
				}else{
					command.executeSlash(interaction, client)
				}
			});
		})
    }
}