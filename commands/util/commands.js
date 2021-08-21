const {MessageEmbed} = require('discord.js');
const {prefixes, colors} = require('../../config.json');
const {toHMS} = require('../../functions');
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
    async execute(message, args){
        const data = [], title = [];
		const { commands } = message.client, avatar = message.client.user.displayAvatarURL();
		if (!args.length) {
			title.push(`Name - Description - Cooldown`);
        	commands.forEach(c => {if(c.name !== 'Secret')data.push(`**• ${c.name}** - *${c.description}* - *${toHMS(parseInt(c.cooldown), false)}*`)});
			message.channel.send({ embeds: [new MessageEmbed().setAuthor(title.join(''), avatar).setDescription(data.join('\n')).setColor(colors.main)]})
		}
		if(args[0]){
			const name = args[0].toLowerCase();
			const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
			if (!command) {return message.reply('that\'s not a valid command!')}
			title.push(`Command: ${command.name}`);
			if (command.aliases[0] === commands.name) {data.push(`**• Aliases:** NONE`)} else {data.push(`**• Aliases:** ${command.aliases.join(', ')}`)}
			if (command.description === '') {data.push(`**• Description:** NONE`)} else {data.push(`**• Description:** ${command.description}`)}
			if (command.category === '') {data.push(`**• Category:** NONE`)} else {data.push(`**• Category:** ${command.category}`)}
			if (command.usage === '') {data.push(`**• Usage:** NONE`)} else {data.push(`**• Usage:** ${command.usage.replace('&&', prefixes[0])}`)}
			if (command.examples[0] === 'NONE') {data.push(`**• Examples:** NONE`)} else {data.push(`**• Examples:** ${prefixes[0]}${command.examples.join(`, ${prefixes[0]}`)}`)}
			data.push(`**• Cooldown:** ${command.cooldown} seconds`);
			data.push(`**• NSFW:** ${command.nsfw}`);
			data.push(`**• Disabled:** ${command.disabled}`);
			if(command.permissions === undefined){data.push(`**• Permissions:** NONE`)} else {data.push(`**• Permissions:** ${command.permissions}`)};
			message.channel.send({embeds:[new MessageEmbed().setAuthor(title.join(''), avatar).setDescription(data.join('\n')).setColor(colors.main)]})
		}
    }
}