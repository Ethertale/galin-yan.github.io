// Style tile: live Kazanlak time for the HUD stamp prototype ([data-clock]).
(function () {
    'use strict';

    var clocks = document.querySelectorAll('[data-clock]');
    if (!clocks.length || !window.Intl) return;

    var fmt = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Sofia', hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
    });

    function tick() {
        var text = fmt.format(new Date()).toUpperCase();   // e.g. "18:42 EET"
        clocks.forEach(function (el) { el.textContent = text; });
    }

    tick();
    setInterval(tick, 15000);
})();
