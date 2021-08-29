const {colors, feedsJson} = require('../../config.json');
const feeds = require(feedsJson);
const {MessageEmbed} = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
.setName('feeds')
.setDescription('Shows a list of all current feeds.');
module.exports = {
    name: 'Feeds',
    aliases: ['viewfeeds'],
    description: 'Shows a list of all current feeds.',
    usage: 'feeds',
    examples: ['NONE'],
    cooldown: 5,
    category: 'utility',
    nsfw: false,
    disabled: false,
    //permissions: '',
    data,
    execute(message, args){
        const data = []; 
        const client = message.client;
        const feedsArray = Object.values(feeds);
        feedsArray.forEach(feed => {
            data.push(`**• ${feed.name}**`)
            data.push(`Refresh Rate: ${feed.cooldown} seconds`)
            data.push(`Channel: <#${feed.channel}>`)
            data.push(`Link: ${feed.link}\n`)
        });
        message.channel.send({embeds:[new MessageEmbed().setAuthor("Feed List", client.user.displayAvatarURL()).setDescription(data.join('\n')).setColor(colors.main)]})
    },
    async executeInteraction(interaction, client){
        const data = []; 
        const feedsArray = Object.values(feeds);
        feedsArray.forEach(feed => {
            data.push(`**• ${feed.name}**`)
            data.push(`Refresh Rate: ${feed.cooldown} seconds`)
            data.push(`Channel: <#${feed.channel}>`)
            data.push(`Link: ${feed.link}\n`)
        });
        await interaction.reply({embeds:[new MessageEmbed().setAuthor("Feed List", client.user.displayAvatarURL()).setDescription(data.join('\n')).setColor(colors.main)]})
    }
}
