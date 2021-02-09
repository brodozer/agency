var btn = document.querySelector('.header_menu__button');
var popupMenu = document.querySelector('.popup-menu');
btn.addEventListener('click', function(e){
	btn.classList.toggle('header_menu__button__toggle');
	popupMenu.classList.toggle('popup-menu__toggle');
});

var imgSrc = [];
function getImgSrc (classImg) {
	var imgSlider = document.querySelectorAll(classImg);
	imgSlider.forEach(el => {
		imgSrc.push(el.getAttribute("src"));
	})
}

var swiperTeam = new Swiper('.swiper-teams', {
	slidesPerView: 1,
	centeredSlides: true,
  	loop: true,
  
  	navigation: {
   	nextEl: '.swiper-btn-next',
   	prevEl: '.swiper-btn-prev'
  	},
  	breakpoints: {
  		992: {
  			slidesPerView: 3,
         centeredSlides: true,              
         loop: true,
  		}
  	}

});

getImgSrc('.img-slide');
console.log(imgSrc);

var swiperReviews = new Swiper('.swiper-reviews', {
	slidesPerView: 1,
	centeredSlides: true,
	type: 'bullets',
	pagination: {
      el: '.swiper-pagination',
		clickable: true,
      renderBullet: function (index, className) {
         return '<span class="' + className + '">' + '<img src="' + imgSrc[index] + '" alt="slide' + (index + 1) +  '">' + '</span>';
      },
    }
});

