'use strict';

function createImages() {
    //if saved in stroage takes it
    gImgs = getFromStorage(KEY_IMAGES);

    //if not creartes a gallery
    if (!gImgs) {
        gImgs = [];
        for (let i = 1; i <= gKeywords.length; i++)  gImgs.push(createImg(i));
    }
}

function createImg(idx) {

    let currKeywords = gKeywords[idx - 1].split(',');
    return {
        id: idx,
        url: `img/${idx}.jpg`,
        keywords: currKeywords
    };
}

function handleImageFromInput(ev) {

    var onImageReady = function renderCanvas(img) {
        //draw img on canvas
        gCanvas.width = img.width;
        gCanvas.height = img.height;
        gCtx.drawImage(img, 0, 0);

        //set max size var
        var MAX_WIDTH = 600;
        var MAX_HEIGHT = 600;

        //take img original size
        var width = img.width;
        var height = img.height;

        //arrange size if too big
        if (width > height) {
            if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
            }
        } else {
            if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
            }
        }
        //set canvas accordingly
        gCanvas.width = width;
        gCanvas.height = height;
        //store img in global
        gMeme.selectedImgId = img;
        // debugger
        gCtx.drawImage(img, 0, 0, width, height);
    }

    //show canvas hide gallery
    gElMemeEditor.style.display = "flex";
    gElGallery.style.display = "none";

    var reader = new FileReader();
    reader.onload = function (event) {
        var img = new Image();
        img.src = event.target.result;
        //global copy
        gHoldImg = new Image();
        gHoldImg.src = event.target.result;

        img.onload = onImageReady.bind(null, img);
    }
    reader.readAsDataURL(ev.target.files[0]);
}

//return an arry of img according to search input
function filterImg(key) {
    return gImgs.filter(function (currImg) {
        for (let i = 0; i < currImg.keywords.length; i++) {

            let word = currImg.keywords[i];
            if (word.indexOf(key) !== -1) return true;
        }
        return false;
    });
}