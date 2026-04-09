// ── TEMA CLARO / ESCURO ───────────────────────────────────────
function toggleTheme() {
  const html = document.documentElement;
  const novo = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', novo);
  localStorage.setItem('ol_theme', novo);
  
  // Atualiza classe nos botões de tema
  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    if (novo === 'light') {
      btn.classList.add('light');
    } else {
      btn.classList.remove('light');
    }
  });
  
  // Atualiza toggle do perfil
  const toggle = document.getElementById('themeToggle');
  if (toggle) toggle.classList.toggle('on', novo === 'light');
}

// Aplica tema salvo ao carregar
(function() {
  const tema = localStorage.getItem('ol_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', tema);
  
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      if (tema === 'light') btn.classList.add('light');
    });
  });
})();

// ── PWA Service Worker ────────────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(() => console.log('[PWA] Registrado!'))
      .catch(e => console.warn('[PWA] Erro:', e));
  });
}