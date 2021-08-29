const {colors} = require('../../config.json')
const {MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
module.exports = {
    name: 'Eval',
    aliases: ['ev'],
    description: 'Disabled, bot owner only.',
    usage: '',
    examples: ['NONE'],
    cooldown: 0,
    category: '',
    nsfw: false,
    disabled: true,
    //permissions: '',
    async execute(message, args){
        if (message.content.includes('token')) return message.channel.send('Token === bad!!');
        try {
            let res = await eval(`try{( async () => { ${args.join(' ')} })()}catch(err){message.channel.send(err)}`);
            typeof (res) !== 'string' ? res = require('util').inspect(res, { depth: 0 }) : res = `'${res}'`;
            if (res.toString().length > 1950) {
                const bin = await (require('sourcebin')).create([{ name: 'eval', content: res.toString(), languageID: 'javascript' }]);
                return message.channel.send({ embeds: [
                    new MessageEmbed()
                    .setTitle('Eval output is too large!')
                    .setDescription(`Evaled contents exceeded the maximum of 2000 characters.\nClick [this link](${bin.url}) to see the full output.`)
                    .setColor(colors.red),
                ]});
            } else {
                message.channel.send({ embeds: [
                    new MessageEmbed()
                    .setTitle('Eval success!')
                    .setDescription(`\`\`\`js\n${res.toString().replace(/`/g, '`\u200b')}\`\`\``)
                    .setColor(colors.main),
                ]});
            }
        } catch (err) {
            message.channel.send({ embeds: [
                new MessageEmbed()
                .setTitle('Eval failed!')
                .setDescription(`\`\`\`js\n${err.toString().replace(/`/g, '`\u200b')}\`\`\``)
                .setColor(colors.red),
            ]});
        }
    }
}

