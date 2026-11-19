// POST /api/contact: the contact form on /contacts (Cloudflare Pages Function).
// Checks the request, verifies Turnstile, then mails the message to info@ through Resend.
// Secrets (Pages → Settings → Variables and Secrets, Production and Preview):
//   RESEND_API_KEY        Resend key with sending access
//   TURNSTILE_SECRET_KEY  secret half of the Turnstile widget (the site key is in src/_data/site.json)
// The browser only ever gets a short error code; details go to the Pages logs.

const TO = 'info@galin-yan.com';
const FROM = 'galin-yan.com <info@galin-yan.com>';
const MAX_BODY = 20000;   // bytes of JSON: far above the field limits, below anything abusive

// Field limits match the maxlength attributes on the form.
const LIMITS = { name: 100, email: 254, message: 5000 };
// Optional "What do you need?" select: the values the form offers, mapped to the label in the email.
const TOPICS = {
    'website': 'A new website',
    'redesign': 'A redesign',
    'web-app': 'A web application',
    'care': 'Care after launch',
    'question': 'Just a question',
};

const json = (status, body) => new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
});

// Strip control characters (incl. CR/LF, which could split an email header) and trim.
const clean = (v, keepNewlines = false) => String(v ?? '')
    .replace(keepNewlines ? /[\u0000-\u0009\u000B\u000C\u000E-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g, ' ')
    .trim();

const escapeHtml = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const EMAIL = /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[^\s@<>()",;:]{2,}$/;

export function validate(data) {
    const f = {
        name: clean(data.name),
        email: clean(data.email),
        message: clean(data.message, true).replace(/\r\n?/g, '\n'),
        topic: clean(data.topic),
    };
    const bad = [];
    if (!f.name || f.name.length > LIMITS.name) bad.push('name');
    if (!EMAIL.test(f.email) || f.email.length > LIMITS.email) bad.push('email');
    if (f.message.length < 2 || f.message.length > LIMITS.message) bad.push('message');
    if (f.topic && !(f.topic in TOPICS)) bad.push('topic');
    return { fields: f, bad };
}

async function verifyTurnstile(token, ip, secret) {
    if (!token || typeof token !== 'string' || token.length > 2048) return false;
    const body = new FormData();
    body.append('secret', secret);
    body.append('response', token);
    if (ip) body.append('remoteip', ip);
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
    const out = await r.json().catch(() => ({}));
    if (!out.success) console.log('turnstile rejected', out['error-codes']);
    return out.success === true;
}

function compose({ name, email, message, topic }, meta) {
    const topicLabel = TOPICS[topic] || 'Not given';
    const subject = `Website message from ${name}` + (topic ? ` (${topicLabel})` : '');
    const text = `Name: ${name}\nEmail: ${email}\nTopic: ${topicLabel}\n\n${message}\n\n--\nSent from ${meta.page} on ${meta.when}`;
    const html = `<p><strong>Name:</strong> ${escapeHtml(name)}<br><strong>Email:</strong> ${escapeHtml(email)}<br><strong>Topic:</strong> ${escapeHtml(topicLabel)}</p>`
        + `<p style="white-space:pre-wrap">${escapeHtml(message)}</p>`
        + `<p style="color:#777;font-size:12px">Sent from ${escapeHtml(meta.page)} on ${escapeHtml(meta.when)}</p>`;
    return { subject, text, html };
}

export async function onRequestPost({ request, env }) {
    try {
        // Same-origin only: the form lives on this site, so any other Origin is someone else's page.
        const origin = request.headers.get('Origin');
        if (!origin || origin !== new URL(request.url).origin) return json(403, { ok: false, error: 'origin' });

        if (!(request.headers.get('Content-Type') || '').startsWith('application/json')) {
            return json(415, { ok: false, error: 'format' });
        }
        const raw = await request.text();
        if (raw.length > MAX_BODY) return json(413, { ok: false, error: 'too-large' });
        let data;
        try { data = JSON.parse(raw); } catch { return json(400, { ok: false, error: 'format' }); }
        if (!data || typeof data !== 'object') return json(400, { ok: false, error: 'format' });

        // Honeypot: a field people never see. Bots that fill it get a normal-looking success and no email.
        if (clean(data.website)) return json(200, { ok: true });

        const { fields, bad } = validate(data);
        if (bad.length) return json(400, { ok: false, error: 'invalid', fields: bad });

        if (!env.RESEND_API_KEY || !env.TURNSTILE_SECRET_KEY) {
            console.error('contact: missing secret', { resend: !!env.RESEND_API_KEY, turnstile: !!env.TURNSTILE_SECRET_KEY });
            return json(500, { ok: false, error: 'server' });
        }

        const ip = request.headers.get('CF-Connecting-IP');
        if (!(await verifyTurnstile(data.turnstile, ip, env.TURNSTILE_SECRET_KEY))) {
            return json(403, { ok: false, error: 'verification' });
        }

        const mail = compose(fields, { page: origin + '/contacts', when: new Date().toISOString() });
        const r = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ from: FROM, to: [TO], reply_to: fields.email, ...mail }),
        });
        if (!r.ok) {
            console.error('contact: resend failed', r.status, await r.text().catch(() => ''));
            return json(502, { ok: false, error: 'server' });
        }
        return json(200, { ok: true });
    } catch (err) {
        console.error('contact: unexpected', err);
        return json(500, { ok: false, error: 'server' });
    }
}
