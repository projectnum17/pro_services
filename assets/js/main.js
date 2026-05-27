'use strict';

const loader = document.querySelector('.loader');
let loaderHidden = false;

const hideLoader = () => {
    if (loader && !loaderHidden) {
        loaderHidden = true;
        loader.classList.add('is-hide');

        setTimeout(() => loader.remove(), 500);
    }
};

if (document.readyState === 'complete') {
    hideLoader();
} else {
    window.addEventListener('load', hideLoader);
}

setTimeout(hideLoader, 7000);

const headerHandlers = () => {
    const header = document.querySelector('.js-header');
    if (!header) return;

    const addPoint = 20;
    const removePoint = 5;

    let transformed = false;

    const handleScroll = () => {
        const y = window.scrollY;

        if (!transformed && y > addPoint) {
            header.classList.add('is-transform');
            transformed = true;
        }

        if (transformed && y < removePoint) {
            header.classList.remove('is-transform');
            transformed = false;
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    const headerTransform = () => {
        const header = document.querySelector('body:has(.hero) .js-header');

        if (!header) return;
        const y = window.scrollY;

        if (y > window.innerHeight - 300) {
            header.classList.remove('is-mutated');
        } else {
            header.classList.add('is-mutated');
        }
    };

    window.addEventListener('scroll', headerTransform);
    headerTransform();
};

const initVideoAutoplay = () => {
    const lazyVideos = Array.from(document.querySelectorAll('.js-video-bg'));

    if (!lazyVideos.length) return;

    const loadAndPlayVideo = (video) => {
        const sources = video.querySelectorAll('source[data-src]');
        sources.forEach((source) => {
            source.src = source.dataset.src;
        });

        video.load();

        video.play().catch((e) => {
            console.warn('Video autoplay failed:', e);
        });

        video.classList.remove('lazyVideo');
    };

    if ('IntersectionObserver' in window) {
        const lazyVideoObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const video = entry.target;
                        loadAndPlayVideo(video);
                        observer.unobserve(video);
                    }
                });
            },
        );

        lazyVideos.forEach((video) => {
            lazyVideoObserver.observe(video);
        });
    } else {
        lazyVideos.forEach(loadAndPlayVideo);
    }
};

const initMobileMenu = () => {
    const toggleStateShowMenu = () => {
        const menuTrigger = document.querySelector('.js-menu-trigger');
        const menuBox = document.querySelector('.js-mob-menu');

        if (!menuTrigger || !menuBox) return;

        const openState = () => {
            document.body.classList.add('is-locked');
            menuBox.classList.add('is-open');
            menuTrigger.classList.add('is-active');
        };

        const closeState = () => {
            document.body.classList.remove('is-locked');
            menuBox.classList.remove('is-open');
            menuTrigger.classList.remove('is-active');

            menuBox
                .querySelectorAll('.nav-panel ul li:has(ul)')
                .forEach((menu) => {
                    menu.classList.remove('is-open');

                    const subMenu = menu.querySelector('ul');

                    if (subMenu) {
                        subMenu.style.height = '0px';
                    }
                });
        };

        menuTrigger.addEventListener('click', (e) => {
            e.stopPropagation();

            menuBox.classList.contains('is-open') ? closeState() : openState();
        });

        menuBox.addEventListener('click', (e) => {
            if (e.target === menuBox) closeState();
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768) {
                closeState();
            }
        });

        const anchors = document.querySelectorAll(
            '.js-mob-menu .nav-panel ul li:has(ul) ul li a',
        );

        anchors.forEach((link) => {
            link.addEventListener('click', closeState);
        });
    };

    const initDDMenu = () => {
        const ddMenu = document.querySelectorAll(
            '.js-mob-menu .nav-panel ul li:has(ul)',
        );

        ddMenu.forEach((menu) => {
            const subMenu = menu.querySelector('ul');
            if (!subMenu) return;

            menu.addEventListener('click', (e) => {
                e.stopPropagation();

                const isOpen = menu.classList.contains('is-open');

                if (!isOpen) {
                    menu.classList.add('is-open');
                    const fullHeight = subMenu.scrollHeight;
                    subMenu.style.height = `${fullHeight}px`;
                } else {
                    menu.classList.remove('is-open');
                    subMenu.style.height = '0px';
                }
            });
        });
    };

    toggleStateShowMenu();
    initDDMenu();
};

const initProcessSlider = () => {
    const { ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);

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
            item.dataset.index = i;

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

    let isNavigating = false;

    const trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: `+=${totalSlides * 300}`,
        pin: true,
        scrub: true,
        snap: {
            snapTo: 1 / (totalSlides - 1),
            duration: 0.1,
            ease: 'power1.out',
        },
        anticipatePin: 1,

        onUpdate: (self) => {
            if (isNavigating) return;

            const index = Math.round(self.progress * (totalSlides - 1));

            if (index !== lastIndex) {
                lastIndex = index;
                updateSlider(index);
            }
        },
    });

    const goToSlide = (index) => {
        if (index === lastIndex) return;

        isNavigating = true;
        lastIndex = index;

        updateSlider(index);

        const progress = index / (totalSlides - 1);
        const scrollPos =
            trigger.start + (trigger.end - trigger.start) * progress;

        gsap.to(window, {
            scrollTo: scrollPos,
            duration: 0.6,
            ease: 'power2.out',
            onComplete: () => {
                isNavigating = false;
            },
        });
    };

    paginationContainer.addEventListener('click', (e) => {
        const item = e.target.closest('.process__pagination');
        if (!item) return;

        goToSlide(+item.dataset.index);
    });

    slides.forEach((slide, i) => {
        slide.addEventListener('click', () => {
            goToSlide(i);
        });
    });
};
const initFAQ = () => {
    const faqBoxes = document.querySelectorAll('.js-faq-box');
    if (!faqBoxes.length) return;

    faqBoxes.forEach((box) => {
        box.addEventListener('click', () => {
            const isOpen = box.classList.contains('is-open');

            faqBoxes.forEach((el) => el.classList.remove('is-open'));

            if (!isOpen) box.classList.add('is-open');
        });
    });
};

const initGridBorderHelper = () => {
    const grid = document.querySelector('.js-brands-box');
    const items = document.querySelectorAll('.js-brands-item');

    if (!grid || items.length === 0) return;

    const updateBorders = () => {
        items.forEach((item) => item.classList.remove('no-border-bottom'));

        const gridComputedStyle = window.getComputedStyle(grid);
        const columns = gridComputedStyle
            .getPropertyValue('grid-template-columns')
            .split(' ').length;

        const totalItems = items.length;
        const lastRowItemsCount = totalItems % columns || columns;

        for (let i = 1; i <= lastRowItemsCount; i++) {
            items[totalItems - i].classList.add('no-border-bottom');
        }
    };

    window.addEventListener('resize', updateBorders);
    updateBorders();
};

const initTestimSlider = () => {
    if (typeof Swiper === 'undefined') return;

    const sliderBlock = document.querySelector('.js-testimonials-slider');
    if (!sliderBlock) return;

    const isMob = window.innerWidth <= 767;

    new Swiper(sliderBlock, {
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
            dragSize: isMob ? 120 : 514,
        },
    });
};

const initForms = () => {
    const forms = document.querySelectorAll('form');
    if (!forms.length) return;

    forms.forEach((form) => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            form.reset();
        });
    });
};

const initModals = ({
    triggers,
    modalSelector,
    boxSelector,
    closeSelector,
}) => {
    const modalTriggers = document.querySelectorAll(triggers);
    const modal = document.querySelector(modalSelector);

    if (!modalTriggers.length || !modal) return;

    const modalBox = modal.querySelector(boxSelector);
    const modalClose = modal.querySelector(closeSelector);
    const form = modal.querySelector('form');

    const input = modal.querySelector('#questionBoxMessage');
    const defaultValue = input ? input.value : '';

    if (!modalBox || !modalClose) return;

    const openState = (e) => {
        e.preventDefault()
        modal.classList.add('is-open');
        document.body.classList.add('is-locked');

        if (input) {
            const productName =
                e.currentTarget.getAttribute('data-product-name');

            input.value = productName || defaultValue;
        }
    };

    const closeState = () => {
        modal.classList.remove('is-open');
        document.body.classList.remove('is-locked');
    };

    modalTriggers.forEach((trigger) => {
        trigger.addEventListener('click', openState);
    });

    modalClose.addEventListener('click', closeState);

    if (form) {
        form.addEventListener('submit', () => {
            closeState();
        });
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeState();
        }
    });
};

document.addEventListener('DOMContentLoaded', () => {
    headerHandlers();
    initVideoAutoplay();
    initMobileMenu();
    initProcessSlider();
    initTestimSlider();
    initFAQ();
    initGridBorderHelper();
    initForms();
    initModals({
        triggers: '.js-request-btn',
        modalSelector: '.js-request-modal',
        boxSelector: '.js-request-box',
        closeSelector: '.js-request-close',
    });
    initModals({
        triggers: '.js-questions-btn',
        modalSelector: '.js-questions-modal',
        boxSelector: '.js-questions-box',
        closeSelector: '.js-questions-close',
    });
    initModals({
        triggers: '.js-review-btn',
        modalSelector: '.js-review-modal',
        boxSelector: '.js-review-box',
        closeSelector: '.js-review-close',
    });
});
