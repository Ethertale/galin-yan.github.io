// Contacts page: copy-email button, and the contact form that posts to /api/contact
// (functions/api/contact.js). States: aria-invalid + .field-msg per field, aria-busy on the
// button while sending, and a .notice in the role="status" result area.
(function () {
    'use strict';

    var emailText = document.getElementById('emailText');
    var copyBtn = document.getElementById('copyEmail');
    var copyStatus = document.getElementById('copyStatus');   // role="status": screen readers hear the result

    copyBtn.addEventListener('click', function () {
        var t = emailText.textContent;
        navigator.clipboard?.writeText(t).then(function () {
            var old = copyBtn.textContent;
            copyBtn.textContent = T.copied;
            copyStatus.textContent = T.copiedStatus;
            setTimeout(function () { copyBtn.textContent = old; copyStatus.textContent = ''; }, 1500);
        }).catch(function () { alert(T.copyFailed); });
    });

    // ── the form ──
    var form = document.getElementById('contactForm');
    var btn = document.getElementById('sendBtn');
    var result = document.getElementById('formResult');
    var mailto = document.getElementById('mailtoLink');
    var email = emailText.textContent.trim();
    var fields = ['name', 'email', 'message'].map(function (id) { return document.getElementById(id); });
    var topic = document.getElementById('topic');

    function isValid(el) {
        var v = el.value.trim();
        if (el.id === 'email') return /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[^\s@<>()",;:]{2,}$/.test(v);
        if (el.id === 'message') return v.length >= 2;
        return v.length > 0;
    }
    function mark(el, bad) {
        if (bad) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
        document.getElementById(el.id + '-msg').hidden = !bad;
    }
    // Errors show after leaving a field (not while typing), and clear as soon as it's fixed.
    fields.forEach(function (el) {
        el.addEventListener('blur', function () { if (el.value.trim()) mark(el, !isValid(el)); });
        el.addEventListener('input', function () { if (el.hasAttribute('aria-invalid') && isValid(el)) mark(el, false); });
    });

    // The "email me directly" link carries whatever they've typed, so nothing is lost if they switch.
    function mailtoHref() {
        var topicText = topic.value ? topic.options[topic.selectedIndex].text : '';
        var subj = T.mailSubject + (topicText ? ' (' + topicText + ')' : '');
        return 'mailto:' + email + '?subject=' + encodeURIComponent(subj) +
            '&body=' + encodeURIComponent(document.getElementById('message').value);
    }
    form.addEventListener('input', function () { mailto.href = mailtoHref(); });

    function show(kind, html) {
        result.innerHTML = '<p class="notice notice-' + kind + '">' + html + '</p>';
    }
    function busy(on) {
        if (on) btn.setAttribute('aria-busy', 'true'); else btn.removeAttribute('aria-busy');
        btn.disabled = on;
        btn.firstElementChild.textContent = on ? T.sending : T.send;
    }
    function resetTurnstile() { if (window.turnstile) window.turnstile.reset(); }


    form.addEventListener('submit', function (e) {
        e.preventDefault();
        result.innerHTML = '';

        var bad = fields.filter(function (el) { var b = !isValid(el); mark(el, b); return b; });
        if (bad.length) { bad[0].focus(); return; }

        var token = (form.querySelector('[name="cf-turnstile-response"]') || {}).value;
        if (!token) {
            show('error', T.tokenWait);
            return;
        }

        busy(true);
        fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: fields[0].value, email: fields[1].value, message: fields[2].value,
                topic: topic.value, lang: document.documentElement.lang, website: document.getElementById('website').value, turnstile: token,
            }),
        })
            .then(function (r) { return r.json().catch(function () { return { ok: false, error: 'server' }; }); })
            .then(function (out) {
                if (out.ok) {
                    form.reset();
                    mailto.href = 'mailto:' + email;
                    show('ok', T.ok);
                    return;
                }
                (out.fields || []).forEach(function (id) { var el = document.getElementById(id); if (el && el.id !== 'topic') mark(el, true); });
                throw out.error;
            })
            .catch(function (code) {
                var msg = (code === 'verification' || code === 'invalid') ? T[code] : T.failed;
                show('error', '<strong>' + msg + '</strong> ' + T.fmt(T.fallback, { href: mailtoHref().replace(/&/g, '&amp;') }));
            })
            .then(function () { busy(false); resetTurnstile(); });
    });
})();
