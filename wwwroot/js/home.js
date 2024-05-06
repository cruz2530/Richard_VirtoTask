$(document).ready(function(){
    $('.slick-carousel').slick({
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        adaptiveHeight: true,
        variableWidth: false,
        arrows: false 
    });
    $('.slick-carousel-2').slick({
        dots: false,
        infinite: true,
        speed: 300,
        slidesToShow: 2.5,
        adaptiveHeight: true,
        variableWidth: false,
        slidesToScroll: 1,
        arrows:true,
        nextArrow: '<div class="next-arrow" ><i class="fa fa-angle-right fa-5x"></i></div>',
        prevArrow: '<div class="prev-arrow"><i class="fa fa-angle-left fa-5x"></i></div>'
      });
      $('.slick-carousel-3').slick({
        dots: false,
        infinite: true,
        speed: 300,
        adaptiveHeight: true,
        variableWidth: false,
        slidesToShow: 1.7,
        slidesToScroll: 1,
        arrows:true,
        nextArrow: '<div class="after-arrow"><i class="fa fa-angle-right fa-3x"></i></div>',
        prevArrow: '<div class="before-arrow"><i class="fa fa-angle-left fa-3x"></i></div>'
      });
  });
  