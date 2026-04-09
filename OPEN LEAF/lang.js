// ── IDIOMA PT / EN ────────────────────────────────────────────
let currentLang = localStorage.getItem('ol_lang') || 'pt';

function toggleLang() {
  currentLang = currentLang === 'pt' ? 'en' : 'pt';
  localStorage.setItem('ol_lang', currentLang);
  aplicarLang();
}

function aplicarLang() {
  // Atualiza label
  document.querySelectorAll('#langLabel').forEach(el => {
    el.textContent = currentLang.toUpperCase();
  });

  // Traduz todos os elementos com data-pt / data-en
  document.querySelectorAll('[data-pt]').forEach(el => {
    const texto = el.getAttribute(`data-${currentLang}`);
    if (texto) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = texto;
      } else {
        el.textContent = texto;
      }
    }
  });

  // Traduz placeholders
  document.querySelectorAll('[data-placeholder-pt]').forEach(el => {
    el.placeholder = el.getAttribute(`data-placeholder-${currentLang}`) || el.placeholder;
  });
}

// Aplica ao carregar
document.addEventListener('DOMContentLoaded', aplicarLang);
