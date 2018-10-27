'use strict'
const KEY_gMEM = 'gMeme';

function createLine(lineText) {

    var line = {
        line: lineText,
        fontSize: 50,
        family: 'impact',
        text_shadow: 0,
        alignText: 'center',
        color: '#ffffff',
        width: 0,
        bold: 0,
        x: 5,
        y: 100,
        moveByArrow: 0,
        isActive: 0
    }

    if(!gMeme.txts.length) line.y = +line.fontSize + 20;
    else if(gMeme.txts.length === 1) line.y = gCanvas.height - parseInt(line.fontSize);
    else line.y = parseInt(gCanvas.height / 2);
    
    return line;
}

function setCanvasSize(){
    var windowWidth = window.innerWidth;
    // console.log('window width ',windowWidth);
    // var canvas = document.querySelector('#memeCanvas');
    if(windowWidth < 830){
        gCanvas.style.width = "100%";
        gCanvas.style.height = "100%";
    }

    console.log('window gCanvas.width ',gCanvas.width);
    console.log('window gCanvas.height ',gCanvas.height);
}

function addLine(txt) {

    gCurrLine = gMeme.txts.push(createLine(txt)) - 1;
    console.log('addLine gCurrLine',gCurrLine);
    
    saveToStorage(KEY_gMEM, gMeme);
}


function alignTextLine(Idx){
   
    if (gMeme.txts[Idx].alignText === 'right') {
        // gMeme.txts[Idx].x = gCanvas.width - gCtx.measureText(gMeme.txts[Idx].line).width - 5;
        gMeme.txts[Idx].x = window.gCanvas.offsetWidth;// - (gCtx.measureText(gMeme.txts[Idx].line).width - 5));
    }
    else if (gMeme.txts[Idx].alignText === 'center') {
        var lineWidth = gCtx.measureText(gMeme.txts[Idx]).width;
        var startingPoint = (window.gCanvas.offsetWidth / 2) - (lineWidth / 2);
        gMeme.txts[Idx].x = startingPoint;
    }
    else gMeme.txts[Idx].x = 5;
    renderCanvas();
}


function deleteLine(lineId) {

    console.log('deleteLine lineId',lineId);
    if (gMeme.txts.length > 0 && lineId >= 0) {
        gMeme.txts.splice(lineId, 1);
        
        if(gMeme.txts.length === 0) {
            gMeme.txts.push(createLine(''));
        }  
        
        gCurrLine = 0;
        console.log('deleteLine gCurrLine',gCurrLine);
        
        var elInputTxt = document.querySelector('.inputText');
        var elInputClr = document.querySelector('.colorPicker');
        elInputTxt.value = gMeme.txts[gCurrLine].line;
        elInputClr.value = gMeme.txts[gCurrLine].color;

        saveToStorage(KEY_gMEM, gMeme);
    }
}

function getActiveLine() {
    return gMeme.txts.findIndex(function (line) {
        return line.isActive;
    })
}

function getLineByCoords(coords) {

    for (var i = 0; i < gMeme.txts.length; i++) {
        var x_endLine = gMeme.txts[i].x + gCtx.measureText(gMeme.txts[i].line).width;
        var y_beginLine = gMeme.txts[i].y - gMeme.txts[i].fontSize;

        if (coords.x >= gMeme.txts[i].x && coords.x <= x_endLine &&
            coords.y <= gMeme.txts[i].y && coords.y >= y_beginLine)
            // console.log('currLine is ',i);
            return i;
    }
}


function resetFirstLine() {
    gMeme = {
        selectedImgId: 1,
        txts: [{
            line: '',
            size: 30,
            family: 'Impact',
            text_shadow: 0,
            align: 'left',
            color: '#ffffff',
            width: 0,
            bold: 0,
            x: 5,
            y: 25,
            isActive: 0
        }],
        memeImage: new Image()
    }
    gCurrLine = 0;
}
