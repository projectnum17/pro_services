export const initModals = ({
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
