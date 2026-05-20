export const initGridBorderHelper = () => {
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
