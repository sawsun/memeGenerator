'use strict';

function init() {

    createImages();
    renderGallery(gImgs);

    //global var
    gElMemeEditor = document.querySelector('.memeEditor');
    gCanvas = document.querySelector('#memeCanvas');
    gCtx = gCanvas.getContext('2d');
    gElGallery = document.querySelector('.galleryWrap');

}

function renderGallery(images) {
    //this function gets an filterd images var only if the gallery is searched
    //if not uses the whole img array 
    if (!images) {
        images = gImgs;
    }

    var strHtml = ''
    strHtml = images.map(function (img, idx) {
        return `<img src="${img.url}" 
        alt="image of ${img.keywords[0]}"  
        data-img = '${img.id}'
        onclick="openEditorOfMeme(this)"> \n`;
    });

    strHtml = strHtml.join('');
    strHtml += `<div class="box">
                    <img src="img/add-pic.png" alt=""> 
                    <input type="file" class="file" name="image" onchange="handleImageFromInput(event)" />
                </div>`

    document.querySelector('.gallery').innerHTML = strHtml;
    renderKeyWords();
}

function renderKeyWords(){

    var datalist = document.querySelector('#keywords');
    var sHTMLs = '',words='';
    
    sHTMLs = gKeywords.map(function(line,idx){
            var word = line.split(',')[0];
            return `<option value = "${word}">`
    });

    datalist.innerHTML = sHTMLs.join(' ');

}

function onSearchImg(searchKey) {
    //for manual input
    if (!searchKey) {
        searchKey = document.querySelector('#search').value;
    }
    searchKey = searchKey.toLowerCase();
    let filters = filterImg(searchKey);
    renderGallery(filters);
}

function onFileInputChange(ev) {
    handleImageFromInput(ev, renderCanvas)
}