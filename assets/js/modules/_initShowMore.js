export const initShowMore = ({
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
            btnMore.classList.add('is-hidden')
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
            btnMore.classList.add('is-hidden')
        });
    });
};
