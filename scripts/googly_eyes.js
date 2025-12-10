const eyeballs = document.querySelectorAll('.eyeball');

eyeballs.forEach(eyeball => {
  const glint = eyeball.querySelector('.eyeglint');
  glint._targetX = 0;
  glint._targetY = 0;
  glint._currentX = 0;
  glint._currentY = 0;
});

document.addEventListener('mousemove', (e) => {
  eyeballs.forEach(eyeball => {
    const glint = eyeball.querySelector('.eyeglint');
    const rect = eyeball.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const dx = e.clientX - (rect.left + centerX);
    const dy = e.clientY - (rect.top + centerY);

    const maxX = rect.width/2 - glint.offsetWidth/2;
    const maxY = rect.height/2 - glint.offsetHeight/2;

    const clampedX = Math.max(-maxX, Math.min(dx, maxX));
    const clampedY = Math.max(-maxY, Math.min(dy, maxY));

    glint._targetX = centerX + clampedX;
    glint._targetY = centerY + clampedY;
  });
});

function animate() {
  eyeballs.forEach(eyeball => {
    const glint = eyeball.querySelector('.eyeglint');

    const ease = 0.15;

    glint._currentX += (glint._targetX - glint._currentX) * ease;
    glint._currentY += (glint._targetY - glint._currentY) * ease;

    glint.style.left = `${glint._currentX}px`;
    glint.style.top = `${glint._currentY}px`;
  });

  requestAnimationFrame(animate);
}

animate();
