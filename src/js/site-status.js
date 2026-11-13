// Projects page: positive-only "Live" badge for client sites (probes each site's favicon).
(function () {
    'use strict';

    const sites = {
        FindADiceStatus: "https://find-a-dice.onrender.com",
        RCTHStatus: "https://rcth-stz.eu",
        MDOilStatus: "https://mdoil.bg",
    };

    const TIMEOUT_MS = 10000;
    const IMAGE_PATH = "/favicon.ico";

    function setStatus(elementId, online) {
        const el = document.getElementById(elementId);
        if (!el) return; // element missing on this page, skip quietly

        // Positive-only: a failed check (timeout, cold start, moved favicon) is
        // not proof a client site is down, so it never shows "Offline".
        if (!online) return;
        el.textContent = "Live";
        el.className = "site-live";
    }

    function checkSite(elementId, baseUrl) {
        const img = new Image();
        let done = false;

        const finish = (online) => {
            if (done) return;
            done = true;
            clearTimeout(timer);
            setStatus(elementId, online);
        };

        const timer = setTimeout(() => finish(false), TIMEOUT_MS);

        img.onload = () => finish(true);
        img.onerror = () => finish(false);

        const url = baseUrl.replace(/\/$/, "") + IMAGE_PATH;
        img.src = `${url}?t=${Date.now()}`;
    }

    function checkAllSites() {
        for (const [elementId, baseUrl] of Object.entries(sites)) {
            checkSite(elementId, baseUrl);
        }
    }

    document.addEventListener("DOMContentLoaded", checkAllSites);
})();
