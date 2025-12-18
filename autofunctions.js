// autofunctions.js - fonctionnalités automatiques: thème, dernier cours, recherche persistante
(function(){
  const themeToggle = () => document.getElementById('themeToggle');
  const root = document.documentElement;

  function getPreferredTheme() {
    const saved = localStorage.getItem('codexlab.theme');
    if (saved) return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
    return 'dark';
  }
  function applyTheme(name) {
    if (name === 'light') root.classList.add('light'); else root.classList.remove('light');
    localStorage.setItem('codexlab.theme', name);
  }
  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(getPreferredTheme());
    const btn = themeToggle();
    if (btn) {
      btn.addEventListener('click', () => {
        const next = root.classList.contains('light') ? 'dark' : 'light';
        applyTheme(next);
      });
    }

    // Restore search field
    const savedSearch = localStorage.getItem('codexlab.search');
    const search = document.getElementById('search');
    if (search && savedSearch) {
      search.value = savedSearch;
    }

    // Show "open last" button if last course exists
    const last = localStorage.getItem('codexlab.lastCourse');
    const openLast = document.getElementById('openLast');
    if (last && openLast) openLast.hidden = false;
  });

  // Keyboard shortcut: "/" focus search
  document.addEventListener('keydown', (e) => {
    if (e.key === '/') {
      const s = document.getElementById('search');
      if (s && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        s.focus();
      }
    }
  });
})();