const pages = document.querySelectorAll('.page');
const sprite = document.querySelector('.sprite');
const prev = document.getElementById('prev');
const next = document.getElementById('next');

let current = 0;
const total = pages.length;

function showPage(index) {
  pages.forEach((p, i) => p.classList.toggle('active', i === index));

  const frame = index % parseInt(getComputedStyle(document.documentElement).getPropertyValue('--frames'));
  const columns = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--columns'));
  const row = Math.floor(frame / columns);
  const col = frame % columns;

  const frameW = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sheet-w')) / columns;
  const frameH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sheet-h')) / Math.ceil(parseInt(getComputedStyle(document.documentElement).getPropertyValue('--frames')) / columns);

  sprite.style.backgroundPosition = `-${col * frameW}px -${row * frameH}px`;
}

prev.addEventListener('click', () => {
  current = (current - 1 + total) % total;
  showPage(current);
});

next.addEventListener('click', () => {
  current = (current + 1) % total;
  showPage(current);
});

showPage(current);
