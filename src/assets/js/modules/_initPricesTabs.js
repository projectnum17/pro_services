import { initShowMore } from './_initShowMore';

export const initPricesTabs = () => {
    const section = document.querySelector('.prices');
    if (!section) return;

    const tabs = section.querySelectorAll('.js-prices-tab');
    const contents = section.querySelectorAll('.js-prices-content');

    const setActiveTab = (index) => {
        tabs.forEach((tab, i) => {
            tab.classList.toggle('is-active', i === index);
        });

        contents.forEach((content, i) => {
            content.classList.toggle('is-active', i === index);
        });
    };

    tabs.forEach((tab, i) => {
        tab.addEventListener('click', () => setActiveTab(i));
    });

    initShowMore({
        container: section,
        cardsSelector: '.js-prices-content',
        itemSelector: '.js-price-box',
        buttonSelector: '.js-prices-more',
        limit: 12,
    });

    setActiveTab(0);
};
