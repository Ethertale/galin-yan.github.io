// Contacts page: copy-email button and the mailto-based form.
// Behaviour is intentionally unchanged from the old inline script; the form is
// rebuilt around the Resend worker in roadmap phase 1.5.
(function () {
    'use strict';

    var emailText = document.getElementById('emailText');
    var copyBtn = document.getElementById('copyEmail');
    var form = document.getElementById('contactForm');
    var openBtn = document.getElementById('openMailClient');

    copyBtn.addEventListener('click', function () {
        var t = emailText.textContent;
        navigator.clipboard?.writeText(t).then(function () {
            var old = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(function () { copyBtn.textContent = old; }, 1500);
        }).catch(function () { alert('Copy failed — please copy manually.'); });
    });

    function openMailClient() {
        var to   = emailText.textContent;
        var subj = encodeURIComponent(document.getElementById('subject').value || 'Hello');
        var body = encodeURIComponent(document.getElementById('message').value || '');
        window.location.href = 'mailto:' + to + '?subject=' + subj + '&body=' + body;
    }

    openBtn.addEventListener('click', openMailClient);

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        openMailClient();
        document.getElementById('status').textContent = 'Mail client opened.';
    });
})();
