const {colors, feedsData, feedsJson} = require('../config.json')
const data = require(feedsData)
const {MessageEmbed} = require('discord.js')
const fetch = require('node-fetch'); 
const {fandom, reddit} = require(feedsJson);
module.exports = {
    start(client){
        //The British Girlfriend Wiki: Recent changes
        const wiki = 'https://the-british-girlfriend.fandom.com/wiki/';
        setInterval(()=>{
            client.channels.fetch(fandom.channel).then(channel => {
                fetch(fandom.link).then(async response => {
                    let body = await response.json();
                    Object.entries(body.query.recentchanges).forEach(([key, value]) => {
                        const found = data.fandom.find(element => element === `${value.revid}${value.pageid}${value.userid}`);
                        if(found === undefined){
                            const post = value; let type = null, color = colors.main, comment = `(${post.parsedcomment})`, length = post.newlen - post.oldlen;
                            if(post.newlen - post.oldlen >= 0){length = `+${post.newlen - post.oldlen}`}
                            if(post.type === 'log'){if(post.logtype === 'upload'){type = 'uploaded'} if(post.logtype === 'delete'){type = 'deleted'} if(post.logtype === 'move'){type = 'moved'} if(post.logtype === 'protect'){type = 'protected'}}
                            if(post.type === 'edit'){type = 'edited'}
                            if(post.type === 'new'){type = 'created page'}
                            if(post.minor !== undefined){comment = `*Minor Edit* (${post.parsedcomment})`}
                            if(post.parsedcomment === ''){comment = ''}
                            if(type === null){console.log(value); type = post.type; color = colors.red}
                            channel.send({embeds:[new MessageEmbed().setDescription(`[${post.user}](${wiki}User:${(post.user).replace(/ /g,"_")}) ${type} [${post.title}](${wiki}${(post.title).replace(/ /g,"_")}) ([cur](${wiki}${(post.title).replace(/ /g,"_")}?curid=${post.pageid}&diff=0&oldid=${post.revid}) | [diff](${wiki}${(post.title).replace(/ /g,"_")}?curid=${post.pageid}&diff=${post.revid}&oldid=${post.old_revid})) (${length}) ${comment}`).setColor(color).setTimestamp(new Date(post.timestamp))]})
                            data.fandom.push(`${post.revid}${post.pageid}${post.userid}`)
                            writeData(data);
                        }
                    })
                }).catch(error => {})
            });
        }, (fandom.cooldown * 1000))
        //The British Girlfriend Reddit: New Posts
        setInterval(()=>{
            client.channels.fetch(reddit.channel).then(channel => {
                const Parser = require('rss-parser'), parser = new Parser({maxRedirects: 2});
                (async () => {
                    try{
                        let feed = await parser.parseURL(reddit.link);
                        feed.items.forEach(async item => {
                            const found = data.reddit.find(element => element === item.id);
                            if(found === undefined){
                                fetch(`${item.link}.json?limit=5`).then(async response => {
                                    let body = await response.json();
                                    let post = body[0].data.children[0].data;
                                    let image = null;
                                    let stp = post.selftext.split('&amp;#x200B;\n')
                                    if(post.media_metadata !== undefined){
                                        let parts = (post.media_metadata[Object.keys(post.media_metadata)[Object.keys(post.media_metadata).length - 1]].s.u).split('amp;');
                                        image = parts.join('');
                                    }
                                    channel.send({embeds:[new MessageEmbed().setTitle(item.title).setURL(item.link).setDescription(stp.join('')).setImage(image).setColor(colors.main).setFooter(`Posted by: ${post.author}`).setTimestamp(new Date((post.created * 1000)))]})
                                    data.reddit.push(item.id); 
                                    writeData(data);
                                }).catch(error => {})
                            }
                        });
                    }catch(err){}
                })();
            }).catch(console.error);
        }, (reddit.cooldown * 1000))
    }
}
function writeData(data){require('fs').writeFile(feedsData, JSON.stringify(data),(err)=>{if(err)console.log(err)})}