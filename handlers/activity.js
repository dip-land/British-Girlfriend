const {activity} = require('../config.json');
const size = Object.keys(activity).length;
require('dotenv').config();
module.exports = {
    async start(client){
        let last = -1;
        check(client, Math.floor(Math.random()*size), last)
        setInterval(function(){check(client, Math.floor(Math.random()*size), last)}, 30000);
    }
}
function check(client, chosen, last){
    if(chosen === last){chosen = Math.floor(Math.random()*size)} 
    else{
        let act = activity[chosen].desc, type = activity[chosen].type;
        //if(chosen === 0){act = activity[chosen].desc.replace("&&&", `${process.env.version}`)}
        client.user.setActivity( act, { type: type })
        last = chosen;
    }
}