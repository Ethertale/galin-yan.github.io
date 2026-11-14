// Shared on every page: footer year, live clocks, scroll reveals.
(function () {
    'use strict';

    // Tells the CSS that scripts run, so [data-reveal] content may start hidden. Without JS it never hides.
    document.documentElement.classList.add('js');

    var year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();

    // HUD clocks: <span data-clock> shows the local time at the base (Kazanlak), e.g. "18:42 EET".
    var clocks = document.querySelectorAll('[data-clock]');
    if (clocks.length && window.Intl) {
        var fmt = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Europe/Sofia', hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
        });
        var tick = function () {
            var text = fmt.format(new Date()).toUpperCase();
            clocks.forEach(function (el) { el.textContent = text; });
        };
        tick();
        setInterval(tick, 15000);
    }

    // Scroll reveal (replaces the AOS library): [data-reveal] gets .is-in once it enters the viewport.
    // Optional delay: data-reveal-delay="100|200" (CSS). Reduced motion is handled in main.css.
    var items = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
        items.forEach(function (el) { el.classList.add('is-in'); });
        return;
    }
    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (!e.isIntersecting) return;
            e.target.classList.add('is-in');
            io.unobserve(e.target);                  // once, like AOS's once: true
        });
    }, { rootMargin: '0px 0px -10% 0px' });
    items.forEach(function (el) { io.observe(el); });
})();
