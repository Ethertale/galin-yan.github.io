// Shared on every page: footer copyright year.
(function () {
    'use strict';
    var year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
})();
