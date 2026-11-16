// About page: certificate lightbox. Requires fancybox.umd.js loaded before this file.
Fancybox.bind('[data-fancybox="certs"]', {
    Toolbar: { display: { left: ['infobar'], middle: [], right: ['close'] } }
});

// "View all": open the lightbox at the diploma (the first certificate link on the page).
document.querySelector('[data-cert-open]').addEventListener('click', function () {
    document.querySelector('[data-fancybox="certs"]').click();
});
