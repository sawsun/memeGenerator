'use strict'

function openEditorOfMeme(elImg) {

    gMeme.selectedImgId = +elImg.getAttribute("data-img");
    setCanvasSize();
    gElMemeEditor.style.display = "flex";
    gElGallery.style.display = "none";
    
    //first line when canvas first opened, init with the default values
    gMeme.txts = [];
    gMeme.txts.push(createLine(''));
    //indicator for the current line in action
    gCurrLine = 0;

    gMeme.memeImage.src = `img/${gMeme.selectedImgId}.jpg`;

    gMeme.memeImage.onload = function () {
        gCanvas.width = this.width;
        gCanvas.height = this.height;
     
        gCtx.drawImage(gMeme.memeImage, 0, 0, gCanvas.width, gCanvas.height)
    }
}

//render the user input on canvas
function renderCanvas() {
    
    //for uploaded images
    if (typeof (gMeme.selectedImgId) !== "number") {
        gMeme.selectedImgId = gHoldImg;
        var img = gMeme.selectedImgId;
    } else {
        var img = new Image();
        img.src = `img/${gMeme.selectedImgId}.jpg`;
    }

    gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
    for (var i = 0; i < gMeme.txts.length; i++) {

        gCtx.font = `${gMeme.txts[i].bold?'bold':'normal'} ${gMeme.txts[i].fontSize}px ${gMeme.txts[i].family}`;
        
        if (gMeme.txts[i].text_shadow) {
            gCtx.offsetX = 10;
            gCtx.offsetY = 10;
            gCtx.shadowColor = gMeme.txts[i].color;
            gCtx.shadowBlur = 20;
        } else {
            gCtx.offsetX = 0;
            gCtx.offsetY = 0;
            gCtx.shadowColor = '';
            gCtx.shadowBlur = 0;
        }

        gCtx.strokeStyle = 'black';
        gCtx.fillStyle = gMeme.txts[i].color;
        gCtx.lineWidth = 3;

        if(gMeme.txts[i].alignText === 'center' && !gMeme.txts[i].moveByArrow){
            gMeme.txts[i].x = gCanvas.width/2;
            gCtx.textAlign = 'center';
        }else if(gMeme.txts[i].alignText === 'right') {
            // gMeme.txts[Idx].x = gCanvas.width - gCtx.measureText(gMeme.txts[Idx].line).width - 5;
            gMeme.txts[i].x = window.gCanvas.offsetWidth;// - (gCtx.measureText(gMeme.txts[Idx].line).width - 5));
            gCtx.textAlign = 'right';
        }
            
        else{
            gMeme.txts[i].x = 5;
            gCtx.textAlign =  gMeme.txts[i].alignText ;
        }
        
        gCtx.strokeText(gMeme.txts[i].line, gMeme.txts[i].x, gMeme.txts[i].y);
        gCtx.fillText(gMeme.txts[i].line, gMeme.txts[i].x, gMeme.txts[i].y);
    }
}

function onAdding() {
    var text = document.querySelector('.inputText');
    text.value = '';
    text.style.backgroundColor = "yellow";

    addLine('');
}

function moveLine(dir) {

    var line_width = gCtx.measureText(gMeme.txts[gCurrLine].line).width;

    switch (dir) {
        case 'left':
            if (gMeme.txts[gCurrLine].x > 10) {
                gMeme.txts[gCurrLine].moveByArrow = 1;
                gMeme.txts[gCurrLine].x -= 50;
            }
            break;
        case 'right':
            if (gMeme.txts[gCurrLine].x < (gCanvas.width - line_width - 10)) gMeme.txts[gCurrLine].x += 50;
            break;
        case 'down':
            if (gMeme.txts[gCurrLine].y < gCanvas.height - gMeme.txts[gCurrLine].fontSize - 10) gMeme.txts[gCurrLine].y += 50;
            break;
        case 'up':
            if (gMeme.txts[gCurrLine].y > 10) gMeme.txts[gCurrLine].y -= 50;
            break;
    }
    renderCanvas();
}

function writeText(elInput) {

    elInput.style.backgroundColor = "#ffffff";
    gMeme.txts[gCurrLine].line = elInput.value;

    renderCanvas();
}

function updateFontSize(elInput) {
    
    if (elInput.getAttribute("data-input") === '+')
        gMeme.txts[gCurrLine].fontSize += 10;
    else if (elInput.getAttribute("data-input") === '-')
        gMeme.txts[gCurrLine].fontSize -= 10;

    renderCanvas();
}

function updateFontColor(elInput) {
    if (elInput.value) gMeme.txts[gCurrLine].color = elInput.value;
    renderCanvas();
}

function updateTextShadow(elInput) {
    if (elInput.checked === true)
        gMeme.txts[gCurrLine].text_shadow = 1;
    else
        gMeme.txts[gCurrLine].text_shadow = 0;

    renderCanvas();
}

function downloadMeme(elLink) {
    elLink.href = gCanvas.toDataURL();
    elLink.download = 'my_canvas.jpg';
}

function updateFontFamily(fontFamily) {
    gMeme.txts[gCurrLine].family = fontFamily;
    renderCanvas();
}

// function alignText(direction) {

//     gMeme.txts[gCurrLine].alignText = direction;
//     renderCanvas();
// }

function handleLineText(ev) {
    
    var x = ev.clientX - gCanvas.offsetLeft;
    var y = ev.clientY - gCanvas.offsetTop;

    // console.log('x', x)
    // console.log('y', y)

    // gCurrLine = getLineByCoords({ x, y });
}

function onDeleteLine() {
    var inputText = document.querySelector('.inpt-txt1');
    inputText.value = gMeme.txts[gCurrLine].line;
    
    deleteLine(gCurrLine);
    inputText.value = gMeme.txts[gCurrLine].line;

    if (!gMeme.txts.length || gCurrLine < 0) gCurrLine = 0;

    renderCanvas();
}

function pagination() {

    if (!gMeme.txts.length) return;

    var elInputTxt = document.querySelector('.inputText');
    var elInputClr = document.querySelector('.colorPicker');
    
    gCurrLine++;
    if(gCurrLine >= gMeme.txts.length ) gCurrLine = 0;
   
    elInputTxt.value = gMeme.txts[gCurrLine].line;
    elInputClr.value = gMeme.txts[gCurrLine].color;
    gMeme.txts.map(function(line,idx){
        line.isActive = 0;
    });

    gMeme.txts[gCurrLine].isActive = 1; 
}

function onAlignText(direction){
    console.log('direction ',direction);
    
    gMeme.txts[gCurrLine].moveByArrow = 0;
    gMeme.txts[gCurrLine].alignText = direction;
    alignTextLine(gCurrLine);
}
