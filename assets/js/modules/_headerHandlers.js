export const headerHandlers = () => {
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
