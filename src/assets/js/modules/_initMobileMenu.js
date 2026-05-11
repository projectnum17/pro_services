export const initMobileMenu = () => {
    const toggleStateShowMenu = () => {
        const menuTrigger = document.querySelector('.js-menu-trigger');
        const menuBox = document.querySelector('.js-mob-menu');
        if (!menuTrigger || !menuBox) return;

        const openState = () => {
            document.body.classList.add('is-locked');
            menuBox.classList.add('is-open');
            menuTrigger.classList.add('is-active');
        };

        const closeState = () => {
            document.body.classList.remove('is-locked');
            menuBox.classList.remove('is-open');
            menuTrigger.classList.remove('is-active');
        };

        menuTrigger.addEventListener('click', (e) => {
            e.stopPropagation();

            menuBox.classList.contains('is-open') ? closeState() : openState();
        });

        menuBox.addEventListener('click', (e) => {
            if (e.target === menuBox) {
                closeState();
            }
        });
    };

    const initDDMenu = () => {
        const ddMenu = document.querySelectorAll(
            '.js-mob-menu .nav-panel ul li:has(ul)',
        );
        if (!ddMenu.length) return;

        ddMenu.forEach((menu) => {
            menu.addEventListener('click', (e) => {
                e.stopPropagation();
                menu.classList.toggle('is-open');
            });
        });
    };

    toggleStateShowMenu();
    initDDMenu();
};
