const {MessageEmbed} = require('discord.js');
const {colors} = require('../../config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
.setName('embed')
.setDescription('Create or edit an embed.')
.addSubcommand(subcommand =>
    subcommand
    .setName('create')
    .setDescription('Create an embed.')
    .addChannelOption(option => option.setName('channel').setDescription('Channel you want to send embed to').setRequired(true))
    .addStringOption(option => option.setName('author').setDescription('Embed Author'))
    .addStringOption(option => option.setName('color').setDescription('Embed Color, Must be hex code'))
    .addStringOption(option => option.setName('description').setDescription('Embed Description'))
    .addStringOption(option => option.setName('footer').setDescription('Embed Footer'))
    .addStringOption(option => option.setName('image').setDescription('Embed Image'))
    .addStringOption(option => option.setName('thumbnail').setDescription('Embed Thumbnail'))
    .addStringOption(option => option.setName('title').setDescription('Embed Title'))
    .addStringOption(option => option.setName('url').setDescription('Embed URL'))
        
)
.addSubcommand(subcommand =>
    subcommand
    .setName('edit')
    .setDescription('Edit an embed.')
    .addChannelOption(option => option.setName('channel').setDescription('Channel that the embed was sent in').setRequired(true))
    .addStringOption(option => option.setName('message_id').setDescription('MessageID of the embed you want to edit').setRequired(true))
    .addStringOption(option => option.setName('author').setDescription('Embed Author'))
    .addStringOption(option => option.setName('color').setDescription('Embed Color, Must be hex code'))
    .addStringOption(option => option.setName('description').setDescription('Embed Description'))
    .addStringOption(option => option.setName('footer').setDescription('Embed Footer'))
    .addStringOption(option => option.setName('image').setDescription('Embed Image'))
    .addStringOption(option => option.setName('thumbnail').setDescription('Embed Thumbnail'))
    .addStringOption(option => option.setName('title').setDescription('Embed Title'))
    .addStringOption(option => option.setName('url').setDescription('Embed URL'))
);
module.exports = {
    name: 'Embed',
    aliases: ['createembed'],
    description: 'Create or edit an embed.',
    usage: 'embed [String]',
    examples: ['embed 877197138252161097 Author ;; Color ;; Description ;; Footer ;; Image ;; Thumbnail ;; Title ;; URL'],
    cooldown: 2.5,
    category: 'utility',
    nsfw: false,
    disabled: false,
    permissions: 'ADMINISTRATOR',
    data,
    execute(message, args){
        if(args[0] === 'help' || !args[0]){
            return message.channel.send({embeds:[new MessageEmbed().setColor(colors.main).setDescription(`To create an embed just type \`b!embed ChannelID Author ;; Color ;; Description ;; Footer ;; Image ;; Thumbnail ;; Title ;; URL\` \nMake sure to seprate each parameter with \` ;; \` or else the command will error, also make sure to know the structure of an embed for more info on embeds [click here](https://discordjs.guide/popular-topics/embeds.html). If you want to exclude a parameter type \`;excludeParam\` in the parmeters place.\nTo edit an embed just type \`b!embed edit ChannelID MessageID Author ;; Color ;; Description ;; Footer ;; Image ;; Thumbnail ;; Title ;; URL\`\n\nKey\`\`\`ChannelID - Channel you want to send embed to.\nMessageID - ID of the message you want to edit\nAuthor - author spot of an embed\nColor - color of an embed\nDescription - description of an embed\nFooter - footer of an embed\nImage - image of an embed, must be an image link\nThumbnail - thumbnail of an embed, must be an image link\nTitle - title of an embed\nURL - URL for title\`\`\``)]})
        }
        if(args[0] === 'edit'){
            try{
                let channelID = args[1];
                let messageID = args[2];
                const txt = args.join(' ').split(channelID)[1].split(messageID)[1].split(' ;; ')
                message.client.channels.fetch(channelID).then(async channel => {
                    const oldEmbed = await channel.messages.fetch(messageID); 
                    let author = txt[0], color = txt[1], description = txt[2], footer = txt[3], image = txt[4], thumbnail = txt[5], title = txt[6], url = txt[7];
                    if(txt[0] === ';excludeParam'){author = ''}
                    if(txt[1] === ';excludeParam'){color = colors.main}
                    if(txt[2] === ';excludeParam'){description = ''}
                    if(txt[3] === ';excludeParam'){footer = ''}
                    if(txt[4] === ';excludeParam'){image = undefined}
                    if(txt[5] === ';excludeParam'){thumbnail = undefined}
                    if(txt[6] === ';excludeParam'){title = ''}
                    if(txt[7] === ';excludeParam'){url = undefined}
                    oldEmbed.edit({embeds:[new MessageEmbed().setAuthor(`${author}`).setColor(color).setDescription(`${description}`).setFooter(`${footer}`).setImage(image).setThumbnail(thumbnail).setTitle(`${title}`).setURL(url)]})
                })
            }catch(error){
                message.reply(`Sorry, but there was an error with that command.\n\`\`\`${error}\`\`\`If error persists please contact shhh#7612.`);
                console.error(error);
            }
        }else{
            try{
                let channelID = args[0];
                const txt = args.join(' ').split(channelID)[1].split(' ;; ')
                let author = txt[0], color = txt[1], description = txt[2], footer = txt[3], image = txt[4], thumbnail = txt[5], title = txt[6], url = txt[7];
                if(txt[0] === ' ;excludeParam'){author = ''}
                if(txt[1] === ';excludeParam'){color = colors.main}
                if(txt[2] === ';excludeParam'){description = ''}
                if(txt[4] === ';excludeParam'){image = undefined}
                if(txt[5] === ';excludeParam'){thumbnail = undefined}
                if(txt[6] === ';excludeParam'){title = ''}
                if(txt[7] === ';excludeParam'){url = undefined}
                message.client.channels.fetch(channelID).then(channel => {
                    channel.send({embeds:[new MessageEmbed().setAuthor(`${author}`).setColor(color).setDescription(`${description}`).setFooter(`${footer}`).setImage(image).setThumbnail(thumbnail).setTitle(`${title}`).setURL(url)]})
                })
            }catch(error){
                message.reply(`Sorry, but there was an error with that command.\n\`\`\`${error}\`\`\`If error persists please contact shhh#7612.`);
                console.error(error);
            }
        }
    },
    async executeInteraction(interaction, client){
        if(interaction.options.getSubcommand() === 'create'){
            const channel = interaction.options.getChannel('channel');
            let author = '', color = colors.main, description = '', footer = '', image = undefined, thumbnail = undefined, title = '', url = undefined;
            if(interaction.options.getString('author')){author = interaction.options.getString('author')}
            if(interaction.options.getString('color')){color = interaction.options.getString('color')}
            if(interaction.options.getString('description')){description = interaction.options.getString('description')}
            if(interaction.options.getString('footer')){footer = interaction.options.getString('footer')}
            if(interaction.options.getString('image')){image = interaction.options.getString('image')}
            if(interaction.options.getString('thumbnail')){thumbnail = interaction.options.getString('thumbnail')}
            if(interaction.options.getString('title')){title = interaction.options.getString('title')}
            if(interaction.options.getString('url')){url = interaction.options.getString('url')}
            channel.send({embeds:[new MessageEmbed().setAuthor(`${author}`).setColor(color).setDescription(`${description}`).setFooter(`${footer}`).setImage(image).setThumbnail(thumbnail).setTitle(`${title}`).setURL(url)]})
            await interaction.reply({ content: 'Embed Sent.', ephemeral: true });
        }
        if(interaction.options.getSubcommand() === 'edit'){
            const channel = interaction.options.getChannel('channel');
            const messageID = interaction.options.getString('message_id');
            const oldEmbed = await channel.messages.fetch(messageID); 
            let author = '', color = colors.main, description = '', footer = '', image = undefined, thumbnail = undefined, title = '', url = undefined;
            if(interaction.options.getString('author')){author = interaction.options.getString('author')}
            if(interaction.options.getString('color')){color = interaction.options.getString('color')}
            if(interaction.options.getString('description')){description = interaction.options.getString('description')}
            if(interaction.options.getString('footer')){footer = interaction.options.getString('footer')}
            if(interaction.options.getString('image')){image = interaction.options.getString('image')}
            if(interaction.options.getString('thumbnail')){thumbnail = interaction.options.getString('thumbnail')}
            if(interaction.options.getString('title')){title = interaction.options.getString('title')}
            if(interaction.options.getString('url')){url = interaction.options.getString('url')}
            oldEmbed.edit({embeds:[new MessageEmbed().setAuthor(`${author}`).setColor(color).setDescription(`${description}`).setFooter(`${footer}`).setImage(image).setThumbnail(thumbnail).setTitle(`${title}`).setURL(url)]})
            await interaction.reply({ content: 'Embed edited.', ephemeral: true });
        }
    }
}
