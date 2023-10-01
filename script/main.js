lightbox.option({
    'resizeDuration': 0,
    'wrapAround': true,
    'disableScrolling': true
});

let translateIcon = document.querySelector(".fa-globe");
let translateBar = document.querySelector(".translate");



translateIcon.addEventListener("mousemove", function() {
    activeTranslateBar();
});

translateIcon.addEventListener("mouseleave", function() {
    closeTranslateBar();
})


function activeTranslateBar () {
    translateBar.classList.add("active-translate");
};

function closeTranslateBar () {
    translateBar.classList.remove("active-translate");
};