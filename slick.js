var jq = jQuery.noConflict();
jq(document).ready(function(){
    if (window.innerWidth < 900) {
        jq('.slick-container').slick({
            dots: true,
            infinite: true,
            speed: 1000,
            slidesToShow: 1,
            adaptiveHeight: true,
            autoplay: true,
            autoplaySpeed: 2000,
            fade: true,
            arrows: true,
            prevArrow:"<button type='button' class='slick-prev pull-left'><img src='images/icons8-prev.png'></button>",
            nextArrow:"<button type='button' class='slick-next pull-right'><img src='images/icons8-next.png'></button>"
        });
    }
});

var jq = jQuery.noConflict();
jq(document).ready(function(){
    if (window.innerWidth < 900) {
        jq('.reviews-container').slick({
            dots: false,
            infinite: true,
            speed: 1000,
            slidesToShow: 1,
            adaptiveHeight: true,
            autoplay: true,
            
            autoplaySpeed: 2000,
            fade: true,
            arrows: true,
            prevArrow:"<button type='button' class='slick-prev pull-left'><img src='images/icons8-prev.png'></button>",
            nextArrow:"<button type='button' class='slick-next pull-right'><img src='images/icons8-next.png'></button>"
        });
    }
});

