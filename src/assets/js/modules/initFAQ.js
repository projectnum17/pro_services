export const initFAQ = () => {
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
