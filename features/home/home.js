import { renderNavbar } from "../../shared/js/navbar.js";
import { renderFooter } from "../../shared/js/footer.js";

renderNavbar();
renderFooter();

const swiper = new Swiper(".heroSwiper", {

loop:true,
speed:1000,

autoplay:{
delay:5000,
disableOnInteraction:false
},

pagination:{
el:".swiper-pagination",
clickable:true
},

on:{

init(){
animateText();
},

slideChangeTransitionStart(){

document.querySelectorAll(".hero-subtitle, .hero-title, .hero-btn")
.forEach(el=>{
el.classList.remove("animate__fadeInUp");
el.style.opacity="0";
});

},

slideChangeTransitionEnd(){

setTimeout(()=>{
animateText();
},300);   // delay before animation

}

}

});

function animateText(){

const activeSlide = document.querySelector(".swiper-slide-active");

activeSlide.querySelectorAll(".hero-subtitle, .hero-title, .hero-btn")
.forEach((el,index)=>{

setTimeout(()=>{
el.style.opacity="1";
el.classList.add("animate__fadeInUp");
},index*200);

});

}