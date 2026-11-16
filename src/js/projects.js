// Projects list: filter chips, and old popup links (/projects#slug) forwarded to the project pages.
(function () {
    'use strict';

    // Links shared while projects opened in a popup (1.3.6) looked like /projects#em-di-oil.
    // The hash never reaches the server, so the forward has to happen here.
    var slug = location.hash.slice(1);
    if (slug && /^[a-z0-9-]+$/.test(slug) && document.querySelector('a[href="/projects/' + slug + '"]')) {
        location.replace('/projects/' + slug);
        return;
    }

    var bar = document.querySelector('.filter-bar');
    var chips = bar.querySelectorAll('.filter-chip');
    var items = document.querySelectorAll('.projects-grid > li');
    var status = document.getElementById('filterStatus');

    function apply(kind) {
        var shown = 0;
        items.forEach(function (li) {
            var match = kind === 'all' || li.dataset.kind === kind;
            li.hidden = !match;
            if (match) shown++;
        });
        chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c.dataset.filter === kind)); });
        status.textContent = shown + (shown === 1 ? ' project' : ' projects') + ' shown';
    }

    chips.forEach(function (c) {
        c.addEventListener('click', function () { apply(c.dataset.filter); });
    });
    bar.hidden = false;   // the chips only appear when they work
})();
