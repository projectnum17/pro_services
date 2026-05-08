import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const initProcessSlider = () => {
    const section = document.querySelector('.process');
    const paginationContainer = document.querySelector('.js-process-pag');
    const slides = gsap.utils.toArray('.js-process-slide');

    if (!section || !paginationContainer || !slides.length) return;

    const totalSlides = slides.length;

    const createPagination = () => {
        paginationContainer.innerHTML = '';

        slides.forEach((slide, i) => {
            slide.style.setProperty(
                '--step-num',
                `"${String(i + 1).padStart(2, '0')}"`,
            );

            const item = document.createElement('div');

            item.className = 'process__pagination';
            item.textContent = String(i + 1).padStart(2, '0');

            paginationContainer.appendChild(item);
        });
    };

    const updateSlider = (index) => {
        const numbers = paginationContainer.querySelectorAll(
            '.process__pagination',
        );

        const half = Math.floor(totalSlides / 2);

        numbers.forEach((num, i) => {
            let diff = i - index;

            if (diff > half) diff -= totalSlides;
            if (diff < -half) diff += totalSlides;

            num.style.setProperty('--diff', diff);
            num.dataset.active = diff === 0;
            num.dataset.visible = Math.abs(diff) === 1;
        });

        slides.forEach((slide, i) => {
            slide.style.display = i === index ? 'block' : 'none';
            slide.classList.toggle('is-active', i === index);
        });
    };

    createPagination();
    updateSlider(0);

    let lastIndex = 0;

    ScrollTrigger.create({
        trigger: section,
        start: 'top top',

        end: `+=${window.innerHeight * (totalSlides - 1) * 0.5}`,

        pin: true,

        scrub: true,

        snap: {
            snapTo: 1 / (totalSlides - 1),
            duration: 0.1,
            ease: 'power1.out',
        },

        anticipatePin: 1,

        onUpdate: (self) => {
            const index = Math.round(self.progress * (totalSlides - 1));

            if (index !== lastIndex) {
                lastIndex = index;
                updateSlider(index);
            }
        },
    });
};
