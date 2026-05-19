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

import { headerHandlers } from './modules/_headerHandlers.js';
import { initVideoAutoplay } from './modules/_initVideoAutoplay.js';
import { initMobileMenu } from './modules/_initMobileMenu.js';
import { initProcessSlider } from './modules/_initProcessSlider.js';
import { initTestimSlider } from './modules/_initTestimSlider.js';
import { initFAQ } from './modules/_initFAQ.js';
import { initPricesTabs } from './modules/_initPricesTabs.js';
import { initGridBorderHelper } from './modules/_initGridBorderHelper.js';
import { initShowMore } from './modules/_initShowMore.js';
import { initForms } from './modules/_initForms.js';
import { initModals } from './modules/_initModals.js';

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
