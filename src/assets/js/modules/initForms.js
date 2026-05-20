export const initForms = () => {
    const forms = document.querySelectorAll('form');
    if (!forms.length) return;

    forms.forEach((form) => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            form.reset();
        });
    });
};
