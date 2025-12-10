document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.getElementById('carousel');
  if (!carousel) console.warn('No element with id="carousel" found.');

  const items = carousel
    ? carousel.querySelectorAll('.item')
    : document.querySelectorAll('#carousel .item');

  const chalkboards = Array.from(document.querySelectorAll('div.chalkboard'));
  let position = 4;
  const total = Math.max(1, items.length);
  if (position < 1) position = 1;
  if (position > total) position = total;

  function updateCarousel() {
    if (carousel) carousel.style.setProperty('--position', position);
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

  const persistent = document.getElementById('chalkboard0');
  if (persistent) {
    persistent.style.display = 'block';
    persistent.style.zIndex = 10000;
  }

  items.forEach(item => {
    item.addEventListener('click', (ev) => {
      if (ev && typeof ev.preventDefault === 'function') ev.preventDefault();

      const boardId = item.dataset.board;
      if (!boardId) {
        console.warn('Clicked item has no data-board:', item);
        return;
      }

      const targetId = 'chalkboard' + boardId;
      const targetBoard = document.getElementById(targetId);

      if (!targetBoard) {
        console.warn(`No chalkboard found with id="${targetId}"`);
        return;
      }

      // Toggle target board
      if (targetBoard.style.display === 'block') {
        targetBoard.style.display = 'none';
      } else {
        // Hide all other chalkboards except chalkboard0
        chalkboards.forEach(cb => {
          if (cb.id !== 'chalkboard0') cb.style.display = 'none';
        });

        targetBoard.style.display = 'block';
        targetBoard.style.zIndex = 10;
      }
    });
  });

  const subButtons = document.querySelectorAll('[data-subboard]');
const subBoards = document.querySelectorAll('.subchalkboard');

subButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const idNum = btn.dataset.subboard;
    const target = document.getElementById('subchalkboard' + idNum);

    if (!target) return;

    if (target.style.display === 'block') {
      target.style.display = 'none';
    } else {
      subBoards.forEach(sb => sb.style.display = 'none');
      target.style.display = 'block';
      target.style.zIndex = 3;
    }
  });
});

  updateCarousel();
});
