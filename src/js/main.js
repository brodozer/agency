var btn = document.querySelector('.header_menu__button');
var popupMenu = document.querySelector('.popup-menu');
btn.addEventListener('click', function(e){
	btn.classList.toggle('header_menu__button__toggle');
	popupMenu.classList.toggle('popup-menu__toggle');
})