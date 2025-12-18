// main.js - charge et rend les cours + intégration avec les fonctions automatiques/animations
const DATA_URL = 'data/courses.json';

async function loadData() {
  const res = await fetch(DATA_URL);
  if (!res.ok) throw new Error('Impossible de charger les données');
  return res.json();
}

function createCourseCard(course) {
  const div = document.createElement('article');
  div.className = 'card reveal';
  div.setAttribute('data-id', course.id);
  div.innerHTML = `
    <img src="${course.image}" alt="${escapeHtml(course.title)}" loading="lazy" />
    <h4>${escapeHtml(course.title)}</h4>
    <p>${escapeHtml(course.description)}</p>
    <div class="meta">
      <small class="muted">${escapeHtml(course.level || '')}</small>
      <a class="button" href="course.html?id=${encodeURIComponent(course.id)}">Voir le cours</a>
    </div>`;
  // tilt effect on mouse move - delegate to animations.js via custom event
  div.addEventListener('mousemove', e => {
    const evt = new CustomEvent('card:mousemove', {detail: {el: div, e}});
    window.dispatchEvent(evt);
  });
  div.addEventListener('mouseleave', () => window.dispatchEvent(new CustomEvent('card:mouseleave', {detail:{el:div}})));
  return div;
}

function escapeHtml(s = '') {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function renderCourseList() {
  const container = document.getElementById('courses');
  const search = document.getElementById('search');
  const noResults = document.getElementById('no-results');
  const data = await loadData();
  function render(filter = '') {
    container.innerHTML = '';
    const filtered = data.filter(c =>
      (c.title + ' ' + c.description + ' ' + (c.tags || []).join(' ')).toLowerCase().includes(filter.toLowerCase())
    );
    if (filtered.length === 0) {
      noResults.hidden = false;
      return;
    } else {
      noResults.hidden = true;
    }
    filtered.forEach(c => container.appendChild(createCourseCard(c)));
    // trigger animation reveal observer
    window.dispatchEvent(new CustomEvent('content:updated'));
  }
  render('');
  if (search) {
    search.addEventListener('input', e => {
      render(e.target.value);
      localStorage.setItem('codexlab.search', e.target.value);
    });
  }
  // restore previous search
  const saved = localStorage.getItem('codexlab.search');
  if (saved && search) {
    search.value = saved;
    render(saved);
  }
  // show open-last button if last course exists
  const last = localStorage.getItem('codexlab.lastCourse');
  const openLast = document.getElementById('openLast');
  if (last && openLast) {
    openLast.hidden = false;
    openLast.onclick = () => location.href = `course.html?id=${encodeURIComponent(last)}`;
  }
}

function getQueryParam(name) {
  const params = new URLSearchParams(location.search);
  return params.get(name);
}

async function renderCoursePage() {
  const id = getQueryParam('id');
  const wrapper = document.getElementById('course-container');
  try {
    const data = await loadData();
    const course = data.find(c => c.id === id);
    if (!course) {
      wrapper.innerHTML = '<p>Cours non trouvé.</p>';
      return;
    }
    // Remember last opened course
    localStorage.setItem('codexlab.lastCourse', id);
    const html = [
      `<div class="course-header reveal">`,
      `<div class="thumb"><img src="${course.image}" alt="${escapeHtml(course.title)}"></div>`,
      `<div class="course-body">`,
      `<h2>${escapeHtml(course.title)}</h2>`,
      `<p>${escapeHtml(course.description)}</p>`,
      `<small>Niveau: ${escapeHtml(course.level || 'Débutant')}</small>`,
      `</div>`,
      `</div>`,
      `<section class="lessons reveal">`,
      `<h3>Leçons</h3>`,
      `<ul class="lesson-list">`,
      course.lessons.map((l, idx) => `<li><strong>${escapeHtml(l.title)}</strong><div class="lesson-content">${l.content}</div></li>`).join(''),
      `</ul>`,
      `</section>`
    ].join('');
    wrapper.innerHTML = html;
    window.dispatchEvent(new CustomEvent('content:updated'));
    // Auto-expand code blocks: make them copyable
    wrapper.querySelectorAll('pre code').forEach(code => {
      code.parentElement.setAttribute('tabindex', 0);
    });
  } catch (err) {
    wrapper.innerHTML = `<p>Erreur: ${escapeHtml(err.message)}</p>`;
  }
}

// Auto-detect page
document.addEventListener('DOMContentLoaded', () => {
  const isCoursePage = location.pathname.endsWith('course.html');
  if (isCoursePage) {
    renderCoursePage();
  } else {
    renderCourseList();
    // autofocus search for convenience
    const search = document.getElementById('search');
    if (search) search.focus();
  }
});