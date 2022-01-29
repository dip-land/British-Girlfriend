const {MessageEmbed} = require('discord.js');
const {prefixes, colors} = require('../../config.json');
const {toHMS} = require('../../functions');
const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
.setName('commands')
.setDescription('Shows the list of commands, or a specific command')
.addSubcommand(subcommand => 
	subcommand
	.setName('list')
	.setDescription(`Get list of commands`)
)
.addSubcommand(subcommand => 
	subcommand
	.setName('search')
	.setDescription(`Search for a command`)
	.addStringOption(option => option.setName('command').setDescription('Command you want to search for').setRequired(true))
);
module.exports = {
    name: 'Commands',
    aliases: ['command', 'cmd', 'cmds'],
    description: 'Shows the list of all commands, or one specific command.',
    usage: '&&commands [Command (Optional)]',
    examples: ['commands', 'commands ping'],
    cooldown: 5,
    category: 'utility',
    nsfw: false,
    disabled: false,
    //permissions: '',
	data,
    async execute(message, args){
        const data = [], {commands} = message.client, avatar = message.client.user.displayAvatarURL();
		if (!args.length) {
        	commands.forEach(c => {if(c.name !== 'Secret')data.push(`**• ${c.name}** - *${c.description}* - *${toHMS(parseInt(c.cooldown))}*`)});
			message.channel.send({ embeds: [new MessageEmbed().setAuthor("Name - Description - Cooldown", avatar).setDescription(data.join('\n')).setColor(colors.main)]})
		}
		if(args[0]){
			const name = args[0].toLowerCase(), command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
			if (!command) {return message.reply('that\'s not a valid command!')}
			if (command.aliases[0] === commands.name) {data.push(`**• Aliases:** NONE`)} else {data.push(`**• Aliases:** ${command.aliases.join(', ')}`)}
			if (command.description === '') {data.push(`**• Description:** NONE`)} else {data.push(`**• Description:** ${command.description}`)}
			if (command.category === '') {data.push(`**• Category:** NONE`)} else {data.push(`**• Category:** ${command.category}`)}
			if (command.usage === '') {data.push(`**• Usage:** NONE`)} else {data.push(`**• Usage:** ${command.usage.replace('&&', prefixes[0])}`)}
			if (command.examples[0] === 'NONE') {data.push(`**• Examples:** NONE`)} else {data.push(`**• Examples:** ${prefixes[0]}${command.examples.join(`, ${prefixes[0]}`)}`)}
			data.push(`**• Cooldown:** ${command.cooldown} seconds`);
			data.push(`**• NSFW:** ${command.nsfw}`);
			data.push(`**• Disabled:** ${command.disabled}`);
			if(command.permissions === undefined){data.push(`**• Permissions:** NONE`)} else {data.push(`**• Permissions:** ${command.permissions}`)};
			message.channel.send({embeds:[new MessageEmbed().setAuthor(`Command: ${command.name}`, avatar).setDescription(data.join('\n')).setColor(colors.main)]})
		}
    },
	async executeSlash(interaction, client){
		const {commands} = client, avatar = client.user.displayAvatarURL(), data = [];
		if(interaction.options.getSubcommand() === "list"){
        	commands.forEach(c => {data.push(`**• ${c.name}** - *${c.description}* - *${toHMS(parseInt(c.cooldown))}*`)});
			await interaction.reply({embeds:[new MessageEmbed().setAuthor('Name - Description - Cooldown', avatar).setDescription(data.join('\n')).setColor(colors.main)]})
		}
        if(interaction.options.getSubcommand() === "search"){
			const name = interaction.options.getString('command'), command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
			if (!command) {return await interaction.reply({ content: "Command not found.", ephemeral: true})}
			if (command.aliases[0] === commands.name) {data.push(`**• Aliases:** NONE`)} else {data.push(`**• Aliases:** ${command.aliases.join(', ')}`)}
			if (command.description === '') {data.push(`**• Description:** NONE`)} else {data.push(`**• Description:** ${command.description}`)}
			if (command.category === '') {data.push(`**• Category:** NONE`)} else {data.push(`**• Category:** ${command.category}`)}
			if (command.usage === '') {data.push(`**• Usage:** NONE`)} else {data.push(`**• Usage:** ${command.usage.replace('&&', prefixes[0])}`)}
			if (command.examples[0] === 'NONE') {data.push(`**• Examples:** NONE`)} else {data.push(`**• Examples:** ${prefixes[0]}${command.examples.join(`, ${prefixes[0]}`)}`)}
			data.push(`**• Cooldown:** ${command.cooldown} seconds`);
			data.push(`**• NSFW:** ${command.nsfw}`);
			data.push(`**• Disabled:** ${command.disabled}`);
			if(command.permissions === undefined){data.push(`**• Permissions:** NONE`)} else {data.push(`**• Permissions:** ${command.permissions}`)};
			await interaction.reply({embeds:[new MessageEmbed().setAuthor(`Command: ${command.name}`, avatar).setDescription(data.join('\n')).setColor(colors.main)]})
		}
    }
}