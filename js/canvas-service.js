'use strict'
const KEY_gMEM = 'gMeme';

function createLine(lineText) {
    return {
        line: lineText,
        size: 20,
        family: 'Impact',
        text_shadow: 0,
        align: 'left',
        color: '#313131',
        width: 0,
        bold: 1,
        x: 5,
        y: 25,
        isActive: 0
    }
}

function addLine(txt) {

    gMeme.txts.push(createLine(txt));

    if (gMeme.txts.length === 1) gMeme.txts[0].y = 25;
    else gMeme.txts[gMeme.txts.length - 1].y = gMeme.txts[gMeme.txts.length - 2].y + 25;
    saveToStorage(KEY_gMEM, gMeme);
}

function deleteLine(lineId) {
    if (lineId >= 0) {
        gMeme.txts.splice(lineId, 1);
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
        var y_beginLine = gMeme.txts[i].y - gMeme.txts[i].size;

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
            size: 20,
            family: 'Impact',
            text_shadow: 0,
            align: 'left',
            color: '#313131',
            width: 0,
            bold: 1,
            x: 5,
            y: 25,
            isActive: 0
        }],
        memeImage: new Image()
    }
    gCurrLine = 0;
}
