function imageExists(url, callback){let img = new Image(); img.onload = function(){callback(true)}; img.onerror = function(){callback(false)}; img.src = url}

function random(min, max){return Math.floor(Math.random() * (max - min)) + min}

function roundToTwo(num){return +(Math.round(num + "e+2")  + "e-2")}

function toHMS(num, show_full) {
    if(show_full === false){
        var sec_num = parseInt(num, 10), hours = Math.floor(sec_num / 3600), minutes = Math.floor((sec_num - (hours * 3600)) / 60), seconds = sec_num - (hours * 3600) - (minutes * 60);
        if (hours === 0 && minutes === 0) {return `${seconds} second(s)`}
        else if (hours === 0) {return `${minutes} minute(s)`} else {return `${hours} hour(s)`}
    } else {
        var sec_num = parseInt(num, 10), hours = Math.floor(sec_num / 3600), minutes = Math.floor((sec_num - (hours * 3600)) / 60), seconds = sec_num - (hours * 3600) - (minutes * 60);
        if (hours === 0 && minutes === 0) {return `${seconds} second(s)`}
        else if (hours === 0) {return `${minutes} minute(s) and ${seconds} second(s)`} else {return `${hours} hour(s), ${minutes} minute(s) and ${seconds} second(s)`}
    }
}

function abrvNum(num, fixed){
    let NumAbbr = require('number-abbreviate'), numAbbr = new NumAbbr(['k', 'm', 'b', 't', 'q', 'Q', 's', 'S', 'o', 'n', 'd', 'u']);
    return numAbbr.abbreviate(num, fixed)
}

function progressBar(ctx, x, y, w, h, radius, color, percent){
    let g = w * (percent / 100)
    if(g > w){g = w};
    let r = x + g, b = y + h;
    ctx.beginPath();
    ctx.moveTo(x+radius, y);
    ctx.lineTo(r-radius, y);
    ctx.quadraticCurveTo(r, y, r, y+radius);
    ctx.lineTo(r, y+h-radius);
    ctx.quadraticCurveTo(r, b, r-radius, b);
    ctx.lineTo(x+radius, b);
    ctx.quadraticCurveTo(x, b, x, b-radius);
    ctx.lineTo(x, y+radius);
    ctx.quadraticCurveTo(x, y, x+radius, y);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0)';
}

function text(ctx, text, posX, posY, font, color, align, maxWidth){ctx.font = font; ctx.fillStyle = color; ctx.textAlign = align; ctx.fillText(text,posX,posY,maxWidth)}

module.exports = { imageExists, random, roundToTwo, toHMS, abrvNum, text, progressBar }