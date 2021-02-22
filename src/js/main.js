'use strict';

const body = document.body;
const btns = document.querySelectorAll('.btn-popup');
let imgSrc = [];

const btnsListener = (btns) => {
	btns.forEach(el => {
		el.addEventListener('click', e => {
			e.preventDefault();
			let target = e.target.closest('[data-path]');
			let path = target.dataset.path;
			let popup = document.querySelector(`[data-target="${path}"]`);
			let classToggle = popup.dataset.class;
			popup.classList.toggle(classToggle);
			if(body.classList.contains('stop-scrolling')) {
				enableScroll(body, popup);
			} else {
				disableScroll(body, popup);
			}
		})
	})
}

let disableScroll = function (body, popup) {
	let paddingOffset = window.innerWidth - document.body.offsetWidth + 'px';
	popup.style.paddingRight = paddingOffset;
	body.style.paddingRight = paddingOffset;
	body.classList.add('stop-scrolling');
}

let enableScroll = function (body, popup) {
	body.classList.remove('stop-scrolling');
   popup.style.paddingRight = '0px';
	body.style.paddingRight = '0px';
}

const getImgSrc = (classImg) => {
	let imgSlider = document.querySelectorAll(classImg);
	imgSlider.forEach(el => {
		imgSrc.push(el.getAttribute("src"));
	})
}


btnsListener(btns);
getImgSrc('.img-slide');

const swiperTeam = new Swiper('.swiper-teams', {
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

const swiperReviews = new Swiper('.swiper-reviews', {
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

