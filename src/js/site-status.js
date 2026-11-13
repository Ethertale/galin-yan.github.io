// Projects page: positive-only "Live" badge for client sites (probes each site's favicon).
(function () {
    'use strict';

    // Which sites to check comes from the markup: <small data-live-check="https://...">,
    // rendered from "liveCheck": true in src/_data/projects.json.

    const TIMEOUT_MS = 10000;
    const IMAGE_PATH = "/favicon.ico";

    function setStatus(el, online) {
        // Positive-only: a failed check (timeout, cold start, moved favicon) is
        // not proof a client site is down, so it never shows "Offline".
        if (!online) return;
        el.textContent = "Live";
        el.className = "site-live";
    }

    function checkSite(el, baseUrl) {
        const img = new Image();
        let done = false;

        const finish = (online) => {
            if (done) return;
            done = true;
            clearTimeout(timer);
            setStatus(el, online);
        };

        const timer = setTimeout(() => finish(false), TIMEOUT_MS);

        img.onload = () => finish(true);
        img.onerror = () => finish(false);

        const url = baseUrl.replace(/\/$/, "") + IMAGE_PATH;
        img.src = `${url}?t=${Date.now()}`;
    }

    function checkAllSites() {
        document.querySelectorAll('[data-live-check]').forEach(el => checkSite(el, el.dataset.liveCheck));
    }

    document.addEventListener("DOMContentLoaded", checkAllSites);
})();
