const images = document.querySelectorAll('.img-gallery img');
const wrapper = document.getElementById('wrapper');
const imgWrapper = document.getElementById('bigImg');
const closeBtn = document.getElementById('closeBtn');

const project = document.body.dataset.project;
const imgBasePath = `/rsc/imgs/projects/${project}/`;

images.forEach(img => {
    img.addEventListener('click', () => {
        const filename = img.getAttribute('src').split('/').pop();
        openImage(imgBasePath + filename);
    });
});

function openImage(imageUrl) {
    imgWrapper.src = imageUrl;
    wrapper.style.display = 'flex';
}

closeBtn.addEventListener('click', () => wrapper.style.display = 'none');
wrapper.addEventListener('click', (e) => {
    if (e.target === wrapper) wrapper.style.display = 'none';
});