// Projects page: card -> detail modal. Requires bootstrap.bundle.js loaded before this file.
(function () {
    'use strict';

    // { key: { label, icon } } from src/_data/techs.json, embedded in the page as JSON.
    const TECHS = JSON.parse(document.getElementById('techData').textContent);

    const modalEl    = document.getElementById('projectModal');
    const bsModal    = new bootstrap.Modal(modalEl);
    const modalTitle = modalEl.querySelector('.modal-title');
    const modalImage = document.getElementById('modalImage');
    const modalDesc  = document.getElementById('modalDesc');
    const modalTechs = document.getElementById('modalTechs');
    const modalLink  = document.getElementById('modalLink');

    document.querySelectorAll('.project-card').forEach(card => {
        const open = () => {
            const title = card.dataset.title;
            const img   = card.dataset.img;
            const desc  = card.dataset.desc;
            const techs = (card.dataset.techs || '').split(',').map(t => t.trim()).filter(Boolean);
            const link  = card.dataset.link || '#';

            modalTitle.textContent = title;
            modalImage.src = img;
            modalImage.alt = title + ' cover';
            modalDesc.textContent = desc;
            modalLink.href = link;
            modalLink.querySelector('span').textContent =
                (link && link !== '#') ? 'Open Project →' : 'No Link';

            modalTechs.innerHTML = '';
            techs.forEach(t => {
                const key  = t.toLowerCase();
                const meta = TECHS[key];
                const url  = meta ? meta.icon : `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${key}/${key}-original.svg`;
                const label = meta ? meta.label : t;

                const wrapper = document.createElement('div');
                wrapper.className = 'tool-badge';
                wrapper.title = label;

                const imgEl = document.createElement('img');
                imgEl.src = url;
                imgEl.alt = label;
                imgEl.loading = 'lazy';
                imgEl.onerror = () => { imgEl.style.filter = 'grayscale(1)'; imgEl.style.opacity = '0.6'; };

                wrapper.appendChild(imgEl);
                modalTechs.appendChild(wrapper);
            });

            bsModal.show();
        };

        card.addEventListener('click', open);
        card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') open(); });
    });

    window.addEventListener('keydown', e => {
        if (e.key === 'Escape') bootstrap.Modal.getInstance(modalEl)?.hide();
    });
})();
