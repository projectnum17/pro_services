'use strict';

const initSupportBox = () => {
    const supportTrigger = document.querySelector('.js-support-btn');
    if (!supportTrigger) return;

    supportTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        supportTrigger.classList.toggle('is-active');
    });

    const supportMessage = document.querySelector('.js-support-mess');

    if (supportMessage) {
        setTimeout(() => {
            supportMessage.classList.add('is-show');
        }, 5000);
    }
};

const initSearchPanels = () => {
    const panels = document.querySelectorAll('.js-search-panel');
    if (!panels.length) return;

    panels.forEach((panel) => {
        const input = panel.querySelector('input');
        const clearBtn = panel.querySelector('.js-search-clear');

        if (!input || !clearBtn) return;

        const update = () => {
            panel.classList.toggle('has-value', input.value.trim() !== '');
        };

        input.addEventListener('input', update);

        clearBtn.addEventListener('click', () => {
            input.value = '';
            update();
            input.focus();
        });

        update();
    });
};

const initAuthorizationModal = () => {
    const accountBox = document.querySelector('.js-account-modal');
    if (!accountBox) return;

    const prevStep = accountBox.querySelector('.js-btn-back');
    const nextStep = accountBox.querySelector('.js-btn-next');
    const verifBlock = accountBox.querySelector('.js-verification-block');
    const codeBlock = accountBox.querySelector('.js-code-block');
    const refreshBtn = accountBox.querySelector('.js-code-refresh');

    if (!prevStep || !nextStep || !verifBlock || !codeBlock) return;

    let timer;

    const startCodeTimer = (seconds = 25) => {
        if (!refreshBtn) return;

        const timerText = refreshBtn.querySelector('.js-code-timer');
        if (!timerText) return;

        clearInterval(timer);

        let timeLeft = seconds;

        refreshBtn.disabled = true;

        const update = () => {
            const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
            const secs = String(timeLeft % 60).padStart(2, '0');

            timerText.textContent = `${minutes}:${secs}`;

            if (timeLeft <= 0) {
                clearInterval(timer);
                refreshBtn.disabled = false;
                return;
            }

            timeLeft--;
        };

        update();
        timer = setInterval(update, 1000);
    };

    codeBlock.classList.add('is-hide');

    nextStep.addEventListener('click', () => {
        codeBlock.classList.remove('is-hide');
        verifBlock.classList.add('is-hide');

        startCodeTimer();
    });

    prevStep.addEventListener('click', () => {
        codeBlock.classList.add('is-hide');
        verifBlock.classList.remove('is-hide');

        clearInterval(timer);
    });

    refreshBtn?.addEventListener('click', () => {
        startCodeTimer();
    });

    const initVerificationCode = () => {
        const wrappers = document.querySelectorAll('.js-code-block');

        if (!wrappers.length) return;

        wrappers.forEach((wrapper) => {
            const inputs = [...wrapper.querySelectorAll('.js-code-field')];

            if (!inputs.length) return;

            inputs.forEach((input, index) => {
                input.addEventListener('input', (e) => {
                    const value = e.target.value.slice(-1).toUpperCase();

                    e.target.value = value;

                    if (!value) return;

                    if (index < inputs.length - 1) {
                        inputs[index + 1].focus();
                    } else {
                        input.blur();
                    }
                });

                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Backspace' && !input.value && index > 0) {
                        inputs[index - 1].focus();
                    }
                });

                input.addEventListener('paste', (e) => {
                    e.preventDefault();

                    const data = e.clipboardData
                        .getData('text')
                        .toUpperCase()
                        .slice(0, inputs.length)
                        .split('');

                    data.forEach((char, i) => {
                        inputs[i].value = char;
                    });

                    const lastIndex = Math.min(data.length, inputs.length) - 1;

                    if (lastIndex >= 0) {
                        if (lastIndex < inputs.length - 1) {
                            inputs[lastIndex + 1].focus();
                        } else {
                            inputs[lastIndex].blur();
                        }
                    }
                });
            });
        });
    };

    initVerificationCode();
};

const initTooltip = () => {
    const tooltipParent = document.querySelectorAll('.js-bonuses-box');
    if (!tooltipParent.length) return;

    tooltipParent.forEach((el) => {
        const tooltipToggle = el.querySelector('.js-tooltip'),
            tooltipHint = el.querySelector('.js-hint');

        if (!tooltipToggle || !tooltipHint) return;

        tooltipToggle.addEventListener('click', (e) => {
            e.preventDefault();
            tooltipHint.classList.toggle('is-show');
        });
    });
};

const initServiceStatuses = () => {
    const MOBILE_WIDTH = 1440;

    document.querySelectorAll('.service-statuses').forEach((wrapper) => {
        const inner = wrapper.querySelector('.service-statuses__inner');
        const list = wrapper.querySelector('.service-statuses__list');
        const processItem =
            list?.querySelector('.point-process') || list?.firstElementChild;

        if (!inner || !list || !processItem) return;

        let isOpen = false;
        const isMobile = () => window.innerWidth <= MOBILE_WIDTH;

        const updateState = () => {
            if (!isMobile()) {
                wrapper.classList.remove('is-open');
                inner.style.height = '';
                list.style.transform = '';
                isOpen = false;
                return;
            }

            if (isOpen) {
                wrapper.classList.add('is-open');
                inner.style.height = `${list.scrollHeight}px`;
                list.style.transform = 'translateY(0px)';
            } else {
                wrapper.classList.remove('is-open');
                inner.style.height = `${processItem.offsetHeight}px`;
                list.style.transform = `translateY(-${processItem.offsetTop}px)`;
            }
        };

        wrapper.addEventListener('click', () => {
            if (!isMobile()) return;
            isOpen = !isOpen;
            updateState();
        });

        updateState();

        window.addEventListener('resize', () => {
            requestAnimationFrame(updateState);
        });
    });
};

const initMobileUserMenu = () => {
    const isMob = innerWidth < 768;
    if (!isMob) return;

    const userNav = document.querySelector('.js-cabinet-mob');
    if (!userNav) return;

    const toggleState = userNav.querySelector('.js-cabinet-toggle');
    if (toggleState) {
        toggleState.addEventListener('click', (e) => {
            e.preventDefault();
            userNav.classList.toggle('is-open');
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    initSupportBox();
    initSearchPanels();
    initAuthorizationModal();
    initTooltip();
    initServiceStatuses();
    initMobileUserMenu();
});
