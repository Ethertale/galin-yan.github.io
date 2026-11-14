// Runner notch (Runner Vision): a faint red runner line comes down the gutter and turns 90° into
// its target (a heading or the primary button), so the path marks where to look next.
//
// Markup, inside any positioned element (the "stage"):
//   <div class="runner" data-runner aria-hidden="true"></div> ... <h2 data-runner-target>
// Sets --runner-x / --runner-turn-y / --runner-notch-w on the stage and adds .runner-turns;
// the CSS (main.css) draws the line. Without JS, or on phones, the runner stays hidden.
(function () {
    'use strict';

    var OFFSET = 32;   // runner sits this far left of the content column (in the gutter)
    var GAP = 8;       // px between the notch tip and the target
    var MIN_X = 12;    // never closer than this to the viewport edge

    // Layout position of el inside stage. offsetTop/Left ignore CSS transforms, so a target that
    // is mid-way through a reveal animation is measured where it will end up, not where it is now.
    function offsetIn(el, stage) {
        var x = 0, y = 0;
        while (el && el !== stage) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent; }
        return el === stage ? { x: x, y: y } : null;
    }

    var runners = Array.prototype.slice.call(document.querySelectorAll('[data-runner]'));

    function place(runner) {
        var stage = runner.parentElement;
        var target = stage.querySelector('[data-runner-target]');
        if (!target || getComputedStyle(runner).display === 'none') return;   // hidden on phones
        var t = offsetIn(target, stage);
        if (!t) return;
        var x = Math.max(MIN_X, t.x - OFFSET);
        stage.style.setProperty('--runner-x', Math.round(x) + 'px');
        stage.style.setProperty('--runner-turn-y', Math.round(t.y + target.offsetHeight / 2) + 'px');
        stage.style.setProperty('--runner-notch-w', Math.max(0, Math.round(t.x - x - GAP)) + 'px');
        stage.classList.add('runner-turns');
    }

    function placeAll() { runners.forEach(place); }

    // Draw-in: each runner draws itself (down, then the turn) the first time its stage scrolls into
    // view. The CSS transition does the drawing; reduced motion makes it instant (main.css).
    function draw(stage) { stage.classList.add('runner-drawn'); }
    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (!e.isIntersecting) return;
                // two frames: the start state must be painted once, or the browser skips the transition
                requestAnimationFrame(function () { requestAnimationFrame(function () { draw(e.target); }); });
                io.unobserve(e.target);
            });
        }, { rootMargin: '0px 0px -15% 0px' });
        runners.forEach(function (r) { io.observe(r.parentElement); });
    } else {
        runners.forEach(function (r) { draw(r.parentElement); });
    }

    placeAll();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(placeAll); // sizes depend on webfonts
    window.addEventListener('load', placeAll);
    window.addEventListener('resize', placeAll);
})();
