'use strict'
const KEY_IMAGES = 'memeImages';
var gMeme = {
    selectedImgId: 1,
    txts: [],
    memeImage: new Image()
}

var gImgs, gCurrEl, gCurrLine = 0;
var gElMemeEditor, gElGallery;
var gCanvas, gCtx, gHoldImg;

var gKeywords = [
    'kiss,love,boxing,box', //1
    'view,dance,dancing,happy', //2
    'trump,politic,rabbit', //3
    'cute, dogs, love', //4
    'succes, win, kid', //5
    'cute, dog, baby', //6
    'cat, sleep, work', //7
    'funny,satisfied', //8
    'kid,cheeky,evil', //9
    'explain, so-so', //10
    'evil, quote, funny', //11
    'haim, you', //12
    'dance, africa, kids', //13
    'toy, pixar, explain', //14
    'obama, funny, smile', //15
    'funny, dog, drag', //16
    'baby, funny, happy', //17
    'trump, win, funny', //18
    'surprise, you', //19
    'leo , cheers', //20
    'matrix, cool', //21
    'lord of the rings, chill', //22
    'oprah, happy', //23
    'star trek, laugh, joke', //24
    'potin, politic'];//25