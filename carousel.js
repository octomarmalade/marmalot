const carousel = document.getElementById('carousel');
const items = carousel.querySelectorAll('.item');
const delay = 500;
let position = 3;
const total = items.length;

function updateCarousel() {
    carousel.style.setProperty('--position', position);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        position++;
        if (position > total) position = 1;
        updateCarousel();
    } else if (e.key === 'ArrowLeft') {
        position--;
        if (position < 1) position = total;
        updateCarousel();
    }
});

updateCarousel();
