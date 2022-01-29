const playdl = require('play-dl')
const { AudioPlayerStatus, StreamType, createAudioResource, joinVoiceChannel, createAudioPlayer, getVoiceConnection } = require('@discordjs/voice');
const player = createAudioPlayer();
const { promisify } = require('util');
let data = require('../music.json');
let intervalID = null;
stateChange('Idle')
player.on('error', error => {
    console.error(error);
});
player.on(AudioPlayerStatus.Idle, () => {
    stateChange('Idle')
});
player.on(AudioPlayerStatus.Playing, () => {
    stateChange('Playing')
});

function stateChange(status){
    if(status === 'Idle'){
        data.nowPlaying = {}
        data.nowPlaying.player_status = 'Idle';
        writeData(data);
        intervalID = setInterval(() => {
            if(data.nowPlaying.player_status === "Idle"){
                getNextSong();
            }
        }, 500);
    } else {
        clearInterval(intervalID)
    }
}

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
    if(data.nowPlaying.player_status === 'Idle'){
        return callback(null, {
            status: 0,
            status_text: "Nothing is playing."
        })
    } else {
        return callback(null, {
            status: 1,
            status_text: "Something is playing.",
            player_status: data.nowPlaying.player_status,
            song_information: data.nowPlaying.song_information,
            requested_by: data.nowPlaying.requested_by,
            time: `${toHMS(Math.floor(player._state.playbackDuration / 1000))}`,
            time_seconds: Math.floor(player._state.playbackDuration / 1000),
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

async function queue(search, message){
    const user = message.author, channel = message.channel;
    try {
        if(playdl.validate(search) === 'sp_track'){
            message.reply('Spotify Tracks are currently not supported.')
        } else if(playdl.validate(search) === 'sp_album'){
            message.reply('Spotify Albums are currently not supported.')
        } else if(playdl.validate(search) === 'sp_playlist'){
            message.reply('Spotify Playlists are currently not supported.')
        } else if(playdl.validate(search) === 'yt_video'){
            let videoInfo = await playdl.video_info(search)
            if(data.nowPlaying.player_status === "Idle"){
                message.reply(`Playing \`${videoInfo.video_details.title} [${videoInfo.video_details.durationRaw}]\`. Please note, sometimes it can take a few seconds to start playing.`)
            } else {
                message.reply(`Adding \`${videoInfo.video_details.title}\` to the queue.`)
            }
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
        } else if(playdl.validate(search) === 'yt_playlist'){
            try{
                const playlist = await playdl.playlist_info(search, true)
                message.reply('Queueing playlist...');
                let queued = 0, skipped = 0;
                playlist.videos.forEach(video => {
                    if(video.private === false){
                        data.queue.push({ 
                            song_information:{
                                id: video.id,
                                url: video.url,
                                title: video.title,
                                description: video.description,
                                duration: video.durationRaw,
                                duration_seconds: video.durationInSec
                            },
                            requested_by: {
                                id: user.id,
                                username: user.username,
                                tag: user.tag
                            }
                        });
                        queued++
                    } else {
                        skipped++
                    }
                })
                writeData(data);
                if(skipped > 0){
                    message.reply(`Queued ${queued} videos and skipped ${skipped} private videos.`)
                } else {
                    message.reply(`Queued ${queued} videos.`)
                }
            }catch(error){
                console.log(error)
                message.reply('Playlist is not public or all the videos are hidden.')
            }
        } else {
            message.reply(`Searching for ${search}`)
            let results = await playdl.search(search, { limit: 1, type: "video" })
            if(data.nowPlaying.player_status === "Idle"){
                message.reply(`Playing \`${results[0].title}\` \`${results[0].durationRaw}\`. Please note, sometimes it can take a few seconds to start playing.`)
            } else {
                message.reply(`Adding \`${results[0].title}\` to the queue.`)
            }
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
    } catch (error) {
        message.reply('You must specify a search term or a url to play something. Currently only YouTube video urls work.')
    }
}

function clearQueue(){
    while (data.queue.length){
        data.queue.shift();
    }
    writeData(data);
}

function getNextSong(){
    if(data.queue[0]){
        data.nowPlaying = data.queue[0];
        data.nowPlaying.player_status = 'Playing';
        data.queue.shift();
        writeData(data);
        play(data.nowPlaying.song_information.url);
    } else {
        data.nowPlaying = {}
        data.nowPlaying.player_status = 'Idle';
        writeData(data);
    }
}

async function play(song){
    const stream = await playdl.stream(song);
    const resource = createAudioResource(stream.stream, { inputType: StreamType.Arbitrary, inlineVolume: true });
    resource.volume.setVolume(0.6);
    player.play(resource);
}

function skip(){
    if(!data.queue[0]){
        player.stop();
    } else {
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

function writeData(data){require('fs').writeFile('c:/projects/DiscordBots/tbg/music.json', JSON.stringify(data, null, 2),(err)=>{if(err)console.log(err)})}
module.exports = {join, leave, queue, clearQueue, play, skip, pause, resume, getNowPlaying, getQueue, toHMS}