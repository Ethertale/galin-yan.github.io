// Runner notch: the vertical red runner line turns 90° into a heading, so the
// path itself marks where the content starts (replaces "eyebrow" labels).
//
// Markup:  <div class="runner" data-runner></div> ... <h1 data-runner-target>
// Sets --runner-turn-y / --runner-notch-w on the runner's positioned parent and
// adds .runner-turns; the CSS draws the turn. Without JS the runner stays straight.
(function () {
    'use strict';

    var runner = document.querySelector('[data-runner]');
    var target = document.querySelector('[data-runner-target]');
    if (!runner || !target || !runner.offsetParent) return;

    var stage = runner.offsetParent;
    var OFFSET = 32;   // runner sits this far left of the content column (in the gutter)
    var GAP = 8;       // px between the notch tip and the heading
    var MIN_X = 12;    // never closer than this to the viewport edge

    function place() {
        if (getComputedStyle(runner).display === 'none') return; // hidden on mobile
        var s = stage.getBoundingClientRect();
        var t = target.getBoundingClientRect();
        var contentX = t.left - s.left;                  // where the heading (and content column) starts
        var x = Math.max(MIN_X, contentX - OFFSET);      // runner in the gutter, not through the text
        var y = t.top - s.top + t.height / 2;            // vertical middle of the heading
        stage.style.setProperty('--runner-x', Math.round(x) + 'px');
        stage.style.setProperty('--runner-turn-y', Math.round(y) + 'px');
        stage.style.setProperty('--runner-notch-w', Math.max(0, Math.round(contentX - x - GAP)) + 'px');
        stage.classList.add('runner-turns');
    }

    place();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(place); // heading size depends on the webfont
    window.addEventListener('resize', place);
})();
