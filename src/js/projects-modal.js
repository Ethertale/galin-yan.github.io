// Projects page: card -> detail modal. Requires bootstrap.bundle.js loaded before this file.
(function () {
    'use strict';

    const DEVICONS = {
        java:       ['Java',       'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg'],
        spring:     ['Spring',     'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg'],
        mysql:      ['MySQL',      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg'],
        sqlite:     ['SQLite',     'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg'],
        thymeleaf:  ['Thymeleaf',  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/thymeleaf/thymeleaf-original.svg'],
        html5:      ['HTML5',      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg'],
        css3:       ['CSS3',       'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg'],
        bootstrap:  ['Bootstrap',  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-plain.svg'],
        javascript: ['JavaScript', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg'],
        photoshop:  ['Photoshop',  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-original.svg'],
        junit:      ['JUnit',      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/junit/junit-plain.svg'],
        vuejs:      ['Vue.js',     'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg'],
        docker:     ['Docker',     'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-plain.svg'],
        wordpress:  ['WordPress',  'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/wordpress/wordpress-plain.svg'],
        php:        ['PHP',        'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg'],
        cpanel:     ['CPanel',     'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cpanel/cpanel-original.svg']
    };

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
                const meta = DEVICONS[key];
                const url  = meta ? meta[1] : `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${key}/${key}-original.svg`;
                const label = meta ? meta[0] : t;

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
