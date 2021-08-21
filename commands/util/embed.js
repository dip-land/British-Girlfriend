const {MessageEmbed} = require('discord.js')
const {colors} = require('../../config.json')
module.exports = {
    name: 'embed',
    aliases: ['createembed'],
    description: 'Create an embed',
    usage: 'embed [String]',
    examples: ['embed 877197138252161097 Author ;; Color ;; Description ;; Footer ;; Image ;; Thumbnail ;; Title ;; URL'],
    cooldown: 2.5,
    category: 'utility',
    nsfw: false,
    disabled: false,
    permissions: 'ADMINISTRATOR',
    execute(message, args){
        if(args[0] === 'help' || !args[0]){
            return message.channel.send({
                embeds:[
                    new MessageEmbed()
                    .setColor(colors.main)
                    .setDescription(`To create an embed just type \`b!embed ChannelID Author ;; Color ;; Description ;; Footer ;; Image ;; Thumbnail ;; Title ;; URL\` \nMake sure to seprate each parameter with \` ;; \` or else the command will error, also make sure to know the structure of an embed for more info on embeds [click here](https://discordjs.guide/popular-topics/embeds.html). If you want to exclude a parameter type \`;excludeParam\` in the parmeters place.\nTo edit an embed just type \`b!embed edit ChannelID MessageID Author ;; Color ;; Description ;; Footer ;; Image ;; Thumbnail ;; Title ;; URL\`\n\nKey\`\`\`ChannelID - Channel you want to send embed to.\nMessageID - ID of the message you want to edit\nAuthor - author spot of an embed\nColor - color of an embed\nDescription - description of an embed\nFooter - footer of an embed\nImage - image of an embed, must be an image link\nThumbnail - thumbnail of an embed, must be an image link\nTitle - title of an embed\nURL - URL for title\`\`\``)
                ]
            })
        }
        if(args[0] === 'edit'){
            try{
                let channelID = args[1];
                let messageID = args[2];
                const text = args.join(' ').split(channelID)[1].split(messageID)[1].split(' ;; ')
                message.client.channels.fetch(channelID).then(async channel => {
                    const oldEmbed = await channel.messages.fetch(messageID); 
                    let author = text[0];
                    if(text[0] === ';excludeParam'){author = ''}
                    let color = text[1];
                    if(text[1] === ';excludeParam'){color = colors.main}
                    let description = text[2];
                    if(text[2] === ';excludeParam'){description = ''}
                    let footer = text[3];
                    if(text[3] === ';excludeParam'){footer = ''}
                    let image = text[4];
                    if(text[4] === ';excludeParam'){image = undefined}
                    let thumbnail = text[5];
                    if(text[5] === ';excludeParam'){thumbnail = undefined}
                    let title = text[6];
                    if(text[6] === ';excludeParam'){title = ''}
                    let url = text[7];
                    if(text[7] === ';excludeParam'){url = undefined}
                    oldEmbed.edit({
                        embeds:[
                            new MessageEmbed()
                            .setAuthor(author)
                            .setColor(color)
                            .setDescription(description)
                            .setFooter(footer)
                            .setImage(image)
                            .setThumbnail(thumbnail)
                            .setTitle(title)
                            .setURL(url)
                        ]
                    }).catch((error)=>{
                        message.reply(`Sorry, but there was an error with that command.\n\`\`\`${error}\`\`\`If error persists please contact shhh#7612.`);
                        console.error(error);
                    })
                })
            }catch(error){
                message.reply(`Sorry, but there was an error with that command.\n\`\`\`${error}\`\`\`If error persists please contact shhh#7612.`);
                console.error(error);
            }
        }else{
            try{
                let channelID = args[0];
                const text = args.join(' ').split(channelID)[1].split(' ;; ')
                let author = text[0];
                if(text[0] === ' ;excludeParam'){author = ''}
                let color = text[1];
                if(text[1] === ';excludeParam'){color = colors.main}
                let description = text[2];
                if(text[2] === ';excludeParam'){description = ''}
                let footer = text[3];
                if(text[3] === ';excludeParam'){footer = ''}
                let image = text[4];
                if(text[4] === ';excludeParam'){image = undefined}
                let thumbnail = text[5];
                if(text[5] === ';excludeParam'){thumbnail = undefined}
                let title = text[6];
                if(text[6] === ';excludeParam'){title = ''}
                let url = text[7];
                if(text[7] === ';excludeParam'){url = undefined}
                //console.log(channelID, author, color, description, footer, image, thumbnail, title, url)
                message.client.channels.fetch(channelID).then(channel => {
                    channel.send({
                        embeds:[
                            new MessageEmbed()
                            .setAuthor(author)
                            .setColor(color)
                            .setDescription(description)
                            .setFooter(footer)
                            .setImage(image)
                            .setThumbnail(thumbnail)
                            .setTitle(title)
                            .setURL(url)
                        ]
                    }).catch((error)=>{
                        message.reply(`Sorry, but there was an error with that command.\n\`\`\`${error}\`\`\`If error persists please contact shhh#7612.`);
                        console.error(error);
                    })
                })
            }catch(error){
                message.reply(`Sorry, but there was an error with that command.\n\`\`\`${error}\`\`\`If error persists please contact shhh#7612.`);
                console.error(error);
            }
        }
    }
}
