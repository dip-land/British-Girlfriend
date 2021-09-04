const playdl = require('play-dl')
const { AudioPlayerStatus, StreamType, createAudioResource, joinVoiceChannel, createAudioPlayer, getVoiceConnection } = require('@discordjs/voice');
const data = require('../music.json');
const player = createAudioPlayer();
const { promisify } = require('util');

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

function toHMS(num) {
    let sec_num = parseInt(num, 10);
    let hours = Math.floor(sec_num / 3600);
    let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    let seconds = sec_num - (hours * 3600) - (minutes * 60);
    if(parseInt(seconds) < 10){seconds = `0${seconds}`}
    if(parseInt(minutes) < 10){minutes = `0${minutes}`}
    if(parseInt(hours) === 0 && parseInt(minutes) === 0){return `00:${seconds}`}
    else if(parseInt(hours) === 0){return `${minutes}:${seconds}`} 
    else {return `${hours}:${minutes}:${seconds}`}
}

const getNowPlaying = promisify(function getNowPlaying(callback){
    if(data.nowPlaying.url === undefined){
        return callback(null, {
            status: 0,
            status_text: "Nothing is playing."
        })
    }else{
        return callback(null, {
            status: 1,
            status_text: "Something is playing.",
            player_status: data.nowPlaying.player_status,
            url: data.nowPlaying.url,
            song_information: data.nowPlaying.song_information,
            requested_by: data.nowPlaying.requested_by,
            time: `${toHMS(Math.floor(player._state.playbackDuration / 1000))}`,
            time_seconds: Math.floor(player._state.playbackDuration / 1000)
        })
    }
})

const getQueue = promisify(function getQueue(callback){
    if(data.queue[0]){
        return callback(null, {
            status: 1,
            status_text: "There are songs queued.",
            queue: data.queue
        })
    }else{
        return callback(null, {
            status: 0,
            status_text: "There are no songs queued."
        })
    }
})

function join(channel, guild, adapterCreator){
    const connection = joinVoiceChannel({channelId: channel, guildId: guild, adapterCreator: adapterCreator});
    connection.subscribe(player);
}

function leave(id){
    getVoiceConnection(id).destroy();
}

async function queue(search, user){
    if(search.match(/^((?:https?:)?\/\/)?(?:(?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/)){
        let videoInfo = await playdl.video_info(search)
        data.queue.push({ 
            song_information:{
                id: videoInfo.video_details.id,
                url: videoInfo.video_details.url,
                title: videoInfo.video_details.title,
                description: videoInfo.video_details.description,
                duration: videoInfo.video_details.durationRaw,
                duration_seconds: videoInfo.video_details.durationInSec
            },
            requested_by: {
                id: user.id,
                username: user.username,
                tag: user.tag
            }
        });
        writeData(data);
    } else {
        let results = await playdl.search(search, { limit: 1, type: "video" })
        data.queue.push({ 
            song_information:{
                id: results[0].id,
                url: results[0].url,
                title: results[0].title,
                description: results[0].description,
                duration: results[0].durationRaw,
                duration_seconds: results[0].durationInSec
            },
            requested_by: {
                id: user.id,
                username: user.username,
                tag: user.tag
            }
        });
        writeData(data);
    }
}

function getNextSong(){
    if(data.queue[0]){
        play(data.queue[0].song_information.url);
        data.nowPlaying = data.queue[0];
        data.nowPlaying.player_status = 'Playing';
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

function skip(){
    if(!data.queue[0]){
        player.stop();
    }else{
        getNextSong();
    }
}

function pause(){
    data.nowPlaying.player_status = 'Paused';
    player.pause();
    writeData(data);
}

function resume(){
    data.nowPlaying.player_status = 'Playing';
    player.unpause();
    writeData(data);
}

function writeData(data){require('fs').writeFile('C:/Bots/DiscordBots/tbg/music.json', JSON.stringify(data, null, 2),(err)=>{if(err)console.log(err)})}
module.exports = {join, leave, queue, play, skip, pause, resume, getNowPlaying, getQueue}