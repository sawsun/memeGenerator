'usr strict';

//Navigation between HTML

function goToMain(ev) {
    ev.stopPropagation();
    window.location.href = 'index.html';
    resetFirstLine();
}

function toggleMenu(ev) {
    if (ev) {
        ev.stopPropagation();
    }
    document.body.classList.toggle('open');
}
function goToContact(ev) {
    ev.stopPropagation();
    window.location.href = 'contact.html';
}

function goToAbout(ev) {
    ev.stopPropagation();
    window.location.href = 'about.html';
}

function showGallery(ev) {
    if (ev) {
        ev.stopPropagation();
    }
    gElMemeEditor.style.display = "none";
    gElGallery.style.display = "block";
    resetFirstLine();
}