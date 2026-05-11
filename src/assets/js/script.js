'use strict';

import { headerHandlers } from './modules/_headerHandlers';
import { initVideoAutoplay } from './modules/_initVideoAutoplay';
import { initMobileMenu } from './modules/_initMobileMenu';
import { initProcessSlider } from './modules/_initProcessSlider';
import { initTestimSlider } from './modules/_initTestimSlider';
import { initFAQ } from './modules/_initFAQ';
import { initPricesTabs } from './modules/_initPricesTabs';
import { initGridBorderHelper } from './modules/_initGridBorderHelper';
import { initShowMore } from './modules/_initShowMore';
import { initForms } from './modules/_initForms';
import { initModals } from './modules/_initModals';

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
