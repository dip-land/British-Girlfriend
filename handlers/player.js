const playdl = require('play-dl')
const {AudioPlayerStatus, StreamType, createAudioResource, joinVoiceChannel, createAudioPlayer, getVoiceConnection} = require('@discordjs/voice');
const data = require('../music.json');
const player = createAudioPlayer();

player.on('error', error => {
    console.error(error);
});
player.on(AudioPlayerStatus.Idle, () => {
    getNextSong();
});

setInterval(() => {
    if(player._state.status === 'idle'){
        getNextSong();
    }
}, 1500);
setInterval(() => {
    if(player._state.status === 'playing'){
        console.log(Math.floor(player._state.playbackDuration / 1000))
    }
}, 1000);
function join(channel, guild, adapterCreator){
    const connection = joinVoiceChannel({channelId: channel, guildId: guild, adapterCreator: adapterCreator});
    connection.subscribe(player);
}
function leave(id){
    getVoiceConnection(id).destroy();
}
async function queue(song, user){
    let videoInfo = await playdl.video_info(song)
    data.queue.push({ 
        url: song, 
        songInformation:{
            id: videoInfo.video_details.id,
            url: videoInfo.video_details.url,
            title: videoInfo.video_details.title,
            description: videoInfo.video_details.description,
            duration: videoInfo.video_details.durationRaw,
            durationSeconds: videoInfo.video_details.durationInSec
        },
        requestedBy: {
            id: user.id,
            username: user.username,
            tag: user.tag
        }
    });
    writeData(data);
}
function getNextSong(){
    if(data.queue[0]){
        play(data.queue[0].url);
        data.nowPlaying = data.queue[0];
        data.queue.shift();
        writeData(data);
    }else{
        data.nowPlaying = {}
        writeData(data);
    }
}
async function play(song){
    const stream = await playdl.stream(song);
    const resource = createAudioResource(stream.stream, { inputType: StreamType.Arbitrary, inlineVolume: true });
    resource.volume.setVolume(0.5);
    player.play(resource);
}
function pause(){
    player.pause();
}
function unpause(){
    player.unpause();
}
function writeData(data){require('fs').writeFile('C:/Bots/DiscordBots/tbg/music.json', JSON.stringify(data, null, 2),(err)=>{if(err)console.log(err)})}
module.exports = {join, leave, queue, play, getNextSong, pause, unpause}