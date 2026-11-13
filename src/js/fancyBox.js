document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.img-gallery img').forEach(img => {
        const src = img.getAttribute('src');
        const parent = img.parentElement;

        if (parent && parent.tagName.toLowerCase() === 'a') {
            parent.removeAttribute('target');
            parent.setAttribute('data-fancybox', 'gallery');
        } else {
            const a = document.createElement('a');
            a.href = src;
            a.setAttribute('data-fancybox', 'gallery');
            // transfer alt/title if you want captions
            if (img.alt) a.setAttribute('data-caption', img.alt);
            img.replaceWith(a);
            a.appendChild(img);
        }
    });

    if (window.Fancybox && typeof Fancybox.bind === 'function') {
        Fancybox.bind('[data-fancybox="gallery"]', {});
        console.log('Fancybox v4 bound to gallery.');
    } else if (window.jQuery && jQuery.fn && jQuery.fn.fancybox) {
        jQuery('[data-fancybox="gallery"]').fancybox({});
        console.log('jQuery Fancybox initialized.');
    } else {
        console.warn('Fancybox not found. If you want to use Fancybox, ensure its JS is loaded.');
    }
});
