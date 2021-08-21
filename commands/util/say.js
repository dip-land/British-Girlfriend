module.exports = {
    name: 'Say',
    aliases: ['say'],
    description: 'Make the bot say whatever you want!',
    usage: 'say [String]',
    examples: ['say You should add shhh#7612!'],
    cooldown: 2.5,
    category: 'utility',
    nsfw: false,
    disabled: false,
    permissions: 'ADMINISTRATOR',
    execute(message, args){
        let sayMessage = args.join(" ");
        if(!args[0]){message.channel.send('You must give me something to say.')} 
        else{try{message.delete()}catch(error){}message.channel.send(sayMessage)}
    }
}
