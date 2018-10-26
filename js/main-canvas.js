'use strict'
function setCanvasSize() {
    //should be according to the images size
    gCanvas.width = 500;
    gCanvas.height = 500;
}

function openEditorOfMeme(elImg) {

    gMeme.selectedImgId = +elImg.getAttribute("data-img");

    gElMemeEditor.style.display = "flex";
    gElGallery.style.display = "none";

    gMeme.memeImage.src = `img/${gMeme.selectedImgId}.jpg`;

    gMeme.memeImage.onload = function () {
        gCanvas.width = this.width;
        gCanvas.height = this.height;
        gCtx.drawImage(gMeme.memeImage, 0, 0, gCanvas.width, gCanvas.height)
    }
}

//this function takes care of each change done by the user
function renderCanvas() {
    // debugger
    if (typeof (gMeme.selectedImgId) !== "number") {
        gMeme.selectedImgId = gHoldImg;
        var img = gMeme.selectedImgId;
    } else {
        var img = new Image();
        img.src = `img/${gMeme.selectedImgId}.jpg`;
    }
    gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
    for (var i = 0; i < gMeme.txts.length; i++) {

        gCtx.font = `${gMeme.txts[i].bold} ${gMeme.txts[i].size}px ${gMeme.txts[i].family}`;
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
        gCtx.fillStyle = gMeme.txts[i].color;
        gCtx.fillText(gMeme.txts[i].line, gMeme.txts[i].x, gMeme.txts[i].y);
    }
}

function onAdding() {
    var text = document.querySelector('.inputText');
    text.value = '';
    text.style.backgroundColor = "yellow";

    addLine('');
    gCurrLine++;
}

function moveLine(dir) {

    var line_width = gCtx.measureText(gMeme.txts[gCurrLine].line).width;

    switch (dir) {
        case 'left':
            if (gMeme.txts[gCurrLine].x > 10) gMeme.txts[gCurrLine].x -= 5;
            break;
        case 'right':
            if (gMeme.txts[gCurrLine].x < (gCanvas.width - line_width - 10)) gMeme.txts[gCurrLine].x += 5;
            break;
        case 'down':
            if (gMeme.txts[gCurrLine].y < gCanvas.height - gMeme.txts[gCurrLine].size - 10) gMeme.txts[gCurrLine].y += 5;
            break;
        case 'up':
            if (gMeme.txts[gCurrLine].y > 10) gMeme.txts[gCurrLine].y -= 5;
            break;
    }
    renderCanvas();
}

function writeText(elInput) {

    elInput.style.backgroundColor = "#ffffff";
    if (!gMeme.txts.length)  gMeme.txts.push(createLine(elInput.value));
    gMeme.txts[gCurrLine].line = elInput.value;

    renderCanvas();
}

function updateFontSize(elInput) {
    if (elInput.innerHTML === '+' && gMeme.txts[gCurrLine].x < 1000)
        gMeme.txts[gCurrLine].size += 10;
    else if (elInput.innerHTML === '-')
        gMeme.txts[gCurrLine].size -= 10;

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

function alignText(direction) {
    gMeme.txts[gCurrLine].alignText = direction;
    if (gMeme.txts[gCurrLine].alignText === 'right') gMeme.txts[gCurrLine].x = (gCanvas.width - (gCtx.measureText(gMeme.txts[gCurrLine].line).width + 5));
    else if (gMeme.txts[gCurrLine].alignText === 'center') gMeme.txts[gCurrLine].x = (gCanvas.width - (gCtx.measureText(gMeme.txts[gCurrLine].line).width)) / 2;
    else gMeme.txts[gCurrLine].x = 5;

    renderCanvas();
}

function handleLineText(ev) {
    // console.log('I was clicked x',ev.offsetX);
    // console.log('I was clicked y',ev.offsetY);
    var x = ev.clientX - gCanvas.offsetLeft;
    var y = ev.clientY - gCanvas.offsetTop;

    console.log('x', x)
    console.log('y', y)

    gCurrLine = getLineByCoords({ x, y });
}

function onDeleteLine() {

    deleteLine(gCurrLine);
    // gCurrLine = null;
    if (!gMeme.txts.length) gCurrLine = 0;

    renderCanvas();
}

// ***********************************************************************

function handleMouseDown(ev) {

    // console.log('I am in here');

    let rect = gCanvas.getBoundingClientRect();
    gStartX = ev.clientX - rect.left;
    gStartY = ev.clientY - rect.top;
    // console.log(gStartX, gStartY);

    for (let i = 0; i < gMeme.txts.length; i++) {
        // console.log(gUserInput[i].x, gUserInput[i].y);
        if (elHit(gStartX, gStartY, i)) {
            console.log('in');
            gCurrEl = i;
            gMeme.txts[i].gapX = gStartX - gMeme.txts[i].x;
            gMeme.txts[i].gapY = gMeme.txts[i].y - gStartY;
        }
    }
}

// done dragging
function handleMouseUp(ev) {
    if (gCurrEl === -1) return;
    else {
        gMeme.txts[gCurrEl].isActive = 0;
        gCurrEl = -1;
    }
}


function handleMouseMove(ev) {
    if (gCurrEl < 0) {
        return;
    }
    let rect = gCanvas.getBoundingClientRect();
    let mouseX = ev.clientX - rect.left;
    let mouseY = ev.clientY - rect.top;

    // Put your mousemove stuff here
    let newX = mouseX - gStartX;
    let newY = mouseY - gStartY;
    gStartX = mouseX;
    gStartY = mouseY;

    // let canvasEl = gUserInput[currEl];
    let canvasEl = gMeme.txts[gCurrEl];
    canvasEl.x += newX;
    canvasEl.y += newY;
    renderCanvas();
}

function elHit(x, y, idx) {
    var canvasEl = gMeme.txt[idx];
    return (canvasEl.x <= x && x <= canvasEl.x + canvasEl.width
        && canvasEl.y >= y && y >= canvasEl.y - canvasEl.font_size);
}
