// Shared on every page: footer year, live clocks, scroll reveals.
(function () {
    'use strict';

    // Tells the CSS that scripts run, so [data-reveal] content may start hidden. Without JS it never hides.
    document.documentElement.classList.add('js');

    // Text for scripts in the page's language (layouts/base.njk -> src/_l10n/<lang>.json "js").
    // T.fmt('{n} shown', { n: 3 }) fills placeholders.
    var tjs = document.getElementById('t-js');
    window.T = tjs ? JSON.parse(tjs.textContent) : {};
    window.T.fmt = function (s, v) { return s.replace(/\{(\w+)\}/g, function (m, k) { return k in v ? v[k] : m; }); };

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

    // Language suggestion (partials/nav.njk). Uses the browser's language list, not the visitor's location:
    // a Bulgarian abroad still gets Bulgarian, a tourist in Bulgaria still gets English. Never redirects.
    // Any pick (the EN / БГ switch, the note's link or "No, thanks") is remembered and ends the suggestions.
    var KEY = 'lang-choice';
    var store = function (v) {
        try { if (v === undefined) return localStorage.getItem(KEY); localStorage.setItem(KEY, v); } catch (e) { return null; }
    };
    document.addEventListener('click', function (e) {
        var pick = e.target.closest && e.target.closest('[data-lang-pick]');
        if (!pick) return;
        store(pick.getAttribute('data-lang-pick'));
        var note = pick.closest('.lang-suggest');
        if (note && pick.tagName === 'BUTTON') note.hidden = true;
    });
    if (!store()) {
        var here = document.documentElement.lang;
        var langs = navigator.languages || [navigator.language || ''];
        for (var i = 0; i < langs.length; i++) {
            var want = String(langs[i]).toLowerCase().split('-')[0];
            if (want === here) break;                               // the page already matches an earlier preference
            var offer = /^[a-z]{2,3}$/.test(want) && document.querySelector('[data-lang-suggest="' + want + '"]');
            if (offer) { offer.hidden = false; break; }
        }
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
