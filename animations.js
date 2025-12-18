// animations.js - effects légers : reveal on scroll, tilt on cards, hero slider, parallax
(function(){
  // Reveal on scroll using IntersectionObserver
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, {threshold: 0.12});
  function observeReveals() {
    document.querySelectorAll('.reveal').forEach(el => {
      if (!el.classList.contains('visible')) io.observe(el);
    });
  }
  // run on content update
  window.addEventListener('content:updated', () => requestAnimationFrame(observeReveals));
  // initial
  document.addEventListener('DOMContentLoaded', () => requestAnimationFrame(observeReveals));

  // Tilt effect for cards (lightweight)
  function applyTilt(el, e) {
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotY = (px - 0.5) * 10; // -5..5
    const rotX = (0.5 - py) * 8; // -4..4
    el.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(6px)`;
    el.style.transition = 'transform 0.08s';
  }
  function resetTilt(el) {
    el.style.transform = '';
    el.style.transition = 'transform 0.3s ease';
  }
  window.addEventListener('card:mousemove', (ev) => applyTilt(ev.detail.el, ev.detail.e));
  window.addEventListener('card:mouseleave', (ev) => resetTilt(ev.detail.el));

  // Simple parallax on mouse for hero
  const hero = document.getElementById('hero-slider');
  if (hero) {
    hero.addEventListener('mousemove', e => {
      const rect = hero.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      hero.style.transform = `translate(${px * 6}px, ${py * 6}px)`;
    });
    hero.addEventListener('mouseleave', () => hero.style.transform = '');
  }

  // Hero auto slider
  function startHeroSlider() {
    if (!hero) return;
    const slides = hero.querySelectorAll('.slide');
    let i = 0;
    setInterval(() => {
      slides[i].classList.remove('active');
      i = (i + 1) % slides.length;
      slides[i].classList.add('active');
    }, 3500);
  }
  document.addEventListener('DOMContentLoaded', startHeroSlider);

  // Smooth scrolling for anchors
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (a) {
      e.preventDefault();
      document.querySelector(a.getAttribute('href'))?.scrollIntoView({behavior:'smooth'});
    }
  });
})();