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
        };

        menuTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            menuBox.classList.contains('is-open') ? closeState() : openState();
        });

        menuBox.addEventListener('click', (e) => {
            if (e.target === menuBox) closeState();
        });

        const anchors = document.querySelectorAll(
            '.js-mob-menu .nav-panel ul li:has(ul) ul li a',
        );

        anchors.forEach((link) => {
            link.addEventListener('click', () => {
                closeState();
            });
        });
    };

    const initDDMenu = () => {
        const ddMenu = document.querySelectorAll(
            '.js-mob-menu .nav-panel ul li:has(ul)',
        );

        ddMenu.forEach((menu) => {
            menu.addEventListener('click', (e) => {
                e.stopPropagation();
                menu.classList.toggle('is-open');
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
            const index = Math.round(self.progress * (totalSlides - 1));

            if (index !== lastIndex) {
                lastIndex = index;
                updateSlider(index);
            }
        },
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

const initPricesTabs = () => {
    const section = document.querySelector('.prices');
    if (!section) return;

    const tabs = section.querySelectorAll('.js-prices-tab');
    const contents = section.querySelectorAll('.js-prices-content');
    const disklaimer = section.querySelector('.prices__reminder');

    const hashMap = {
        services: 0,
        spare: 1,
    };

    const setActiveTab = (index, updateHash = true) => {
        tabs.forEach((tab, i) => {
            tab.classList.toggle('is-active', i === index);
        });

        contents.forEach((content, i) => {
            content.classList.toggle('is-active', i === index);
        });

        if (disklaimer) {
            disklaimer.style.display = index === 0 ? '' : 'none';
        }

        if (updateHash) {
            const keys = Object.keys(hashMap);
            history.replaceState(null, null, `#${keys[index]}`);
        }
    };

    const getIndexFromHash = () => {
        const hash = window.location.hash.replace('#', '');
        return hashMap[hash] ?? 0;
    };

    tabs.forEach((tab, i) => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            setActiveTab(i);
        });
    });

    setActiveTab(getIndexFromHash(), false);

    window.addEventListener('hashchange', () => {
        setActiveTab(getIndexFromHash(), false);
    });

    initShowMore({
        container: section,
        cardsSelector: '.js-prices-content',
        itemSelector: '.js-price-box',
        buttonSelector: '.js-prices-more',
        limit: 12,
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

const initShowMore = ({
    container,
    cardsSelector,
    itemSelector,
    buttonSelector,
    limit = 12,
}) => {
    if (!container) return;

    const blocks = container.querySelectorAll(cardsSelector);

    blocks.forEach((block) => {
        const items = block.querySelectorAll(itemSelector);
        const btnMore = block.querySelector(buttonSelector);

        if (!btnMore) return;

        if (items.length <= limit) {
            btnMore.style.display = 'none';
            btnMore.classList.add('is-hidden');
            return;
        }

        items.forEach((item, index) => {
            if (index >= limit) {
                item.style.display = 'none';
            }
        });

        btnMore.addEventListener('click', () => {
            items.forEach((item) => {
                item.style.display = '';
            });

            btnMore.style.display = 'none';
            btnMore.classList.add('is-hidden');
        });
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

    if (!modalBox || !modalClose) return;

    const openState = () => {
        modal.classList.add('is-open');
        document.body.classList.add('is-locked');
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
        form.addEventListener('submit', (e) => {
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
    initPricesTabs();
    initGridBorderHelper();
    initForms();
    initShowMore({
        container: document.querySelector('.preview'),
        cardsSelector: '.js-testimonial-collect',
        itemSelector: '.js-testimonial-box',
        buttonSelector: '.js-testimonial-more',
        limit: 15,
    });
    initShowMore({
        container: document.querySelector('.blog'),
        cardsSelector: '.js-blog-collect',
        itemSelector: '.js-blog-box',
        buttonSelector: '.js-blog-more',
        limit: 8,
    });
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
