export const initVideoAutoplay = () => {
    const lazyVideos = Array.from(document.querySelectorAll('.js-video-bg'));

    if (!lazyVideos.length) return;

    const loadAndPlayVideo = (video) => {
        const sources = video.querySelectorAll('source[data-src]');
        sources.forEach((source) => {
            source.src = source.dataset.src;
        });

        video.load();

        video.play().catch((e) => {
            console.warn('Video autoplay failed:', e);
        });

        video.classList.remove('lazyVideo');
    };

    if ('IntersectionObserver' in window) {
        const lazyVideoObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const video = entry.target;
                        loadAndPlayVideo(video);
                        observer.unobserve(video);
                    }
                });
            },
        );

        lazyVideos.forEach((video) => {
            lazyVideoObserver.observe(video);
        });
    } else {
        lazyVideos.forEach(loadAndPlayVideo);
    }
};
