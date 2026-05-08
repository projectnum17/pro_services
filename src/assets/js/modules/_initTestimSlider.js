import Swiper from 'swiper';
import { Navigation, Scrollbar } from 'swiper/modules';
export const initTestimSlider = () => {
    if (typeof Swiper === 'undefined') return;

    const sliderBlock = document.querySelector('.js-testimonials-slider');
    if (!sliderBlock) return;

    new Swiper(sliderBlock, {
        modules: [Navigation, Scrollbar],
        slidesPerView: 'auto',
        spaceBetween: 10,
        speed: 900,
        grabCursor: true,
        navigation: {
            prevEl: '.js-testimonials-prev',
            nextEl: '.js-testimonials-next',
        },
        scrollbar: {
            el: '.js-testimonials-scrollbar',
            draggable: true,
            dragSize: 514,
        },
    });
};
