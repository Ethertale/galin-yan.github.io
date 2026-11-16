// Project pages: before/after slider and the screenshot lightbox.
(function () {
    'use strict';

    // Before/after: a native range input lies over the images, so mouse, touch and keyboard
    // (arrows, Home/End, Page Up/Down) all work without extra code. It only moves --pos;
    // CSS clips the "before" image to that width. Without JS the slider rests at 50%.
    document.querySelectorAll('[data-ba]').forEach(function (fig) {
        var range = fig.querySelector('.ba-range');
        var set = function () {
            fig.style.setProperty('--pos', range.value + '%');
            range.setAttribute('aria-valuetext', range.value + '% before, ' + (100 - range.value) + '% after');
        };
        range.addEventListener('input', set);
        set();
    });

    // Screenshot gallery (pages with "gallery" in projects.json load Fancybox first).
    if (window.Fancybox) Fancybox.bind('[data-fancybox="gallery"]', {});
})();
