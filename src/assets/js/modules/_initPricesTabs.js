import { initShowMore } from './_initShowMore.js';

export const initPricesTabs = () => {
    const section = document.querySelector('.prices');
    if (!section) return;

    const tabs = section.querySelectorAll('.js-prices-tab');
    const contents = section.querySelectorAll('.js-prices-content');

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
