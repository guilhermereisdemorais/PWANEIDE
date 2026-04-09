// ── BIBLIOTECA ────────────────────────────────────────────────

// Filtros
document.querySelectorAll('.flt').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.flt').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filtrarLivros();
  });
});

function filtrarLivros() {
  const cat    = document.querySelector('.flt.active')?.dataset.cat || 'todos';
  const search = document.getElementById('searchInput')?.value.toLowerCase() || '';
  const cards  = document.querySelectorAll('#booksGrid .book-card');
  let count    = 0;

  cards.forEach(card => {
    const cardCat   = card.dataset.cat   || '';
    const cardTitle = card.dataset.title || '';
    const matchCat  = cat === 'todos' || cardCat === cat;
    const matchSearch = !search || cardTitle.includes(search);
    const show = matchCat && matchSearch;
    card.style.display = show ? 'block' : 'none';
    if (show) count++;
  });

  const countEl = document.getElementById('bookCount');
  if (countEl) countEl.textContent = `${count} livro${count !== 1 ? 's' : ''}`;
}

// Favoritos com ícones SVG
function toggleFav(event, id) {
  event.stopPropagation();
  const favs = JSON.parse(localStorage.getItem('ol_favs') || '[]');
  const btn  = event.currentTarget;
  const idx  = favs.indexOf(id);

  if (idx === -1) {
    favs.push(id);
    btn.innerHTML = '<svg class="fav-icon-filled" viewBox="0 0 24 24" fill="currentColor" stroke="none" width="14" height="14"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
  } else {
    favs.splice(idx, 1);
    btn.innerHTML = '<svg class="fav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="14" height="14"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
  }
  localStorage.setItem('ol_favs', JSON.stringify(favs));
  renderFavoritos();
}

function renderFavoritos() {
  const favs    = JSON.parse(localStorage.getItem('ol_favs') || '[]');
  const grid    = document.getElementById('favGrid');
  const emptyEl = document.getElementById('emptyFav');
  if (!grid) return;

  // Atualiza ícones dos botões
  document.querySelectorAll('.fav-btn[data-id]').forEach(btn => {
    const isFav = favs.includes(btn.dataset.id);
    btn.innerHTML = isFav 
      ? '<svg class="fav-icon-filled" viewBox="0 0 24 24" fill="currentColor" stroke="none" width="14" height="14"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>'
      : '<svg class="fav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="14" height="14"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
  });

  // Pega os cards favoritados
  const favCards = [...document.querySelectorAll('#booksGrid .book-card')]
    .filter(card => {
      const btn = card.querySelector('.fav-btn');
      return btn && favs.includes(btn.dataset.id);
    });

  if (favCards.length === 0) {
    grid.innerHTML = '';
    grid.appendChild(emptyEl || document.createElement('div'));
    if (emptyEl) emptyEl.style.display = 'flex';
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';
  grid.innerHTML = '';
  favCards.forEach(card => {
    const clone = card.cloneNode(true);
    grid.appendChild(clone);
  });
}

// Inicializa
document.addEventListener('DOMContentLoaded', () => {
  renderFavoritos();
  filtrarLivros();
});
// ── BIBLIOTECA PESSOAL (livros comprados/alugados) ───────────
async function renderBiblioteca() {
  const grid = document.getElementById('bibliotecaGrid');
  const emptyEl = document.getElementById('emptyBiblioteca');
  const countEl = document.getElementById('bibliotecaCount');
  
  if (!grid) return;
  
  const biblioteca = await carregarBiblioteca();
  
  if (!biblioteca || biblioteca.length === 0) {
    if (emptyEl) emptyEl.style.display = 'flex';
    grid.innerHTML = '';
    grid.appendChild(emptyEl);
    if (countEl) countEl.textContent = '0 livros';
    return;
  }
  
  if (emptyEl) emptyEl.style.display = 'none';
  if (countEl) countEl.textContent = `${biblioteca.length} livro${biblioteca.length !== 1 ? 's' : ''}`;
  
  // Mapa de capas
  const COVERS = {
    it: 'imagens/It.jpg', fnaf1: 'imagens/fnaf.jpg', fnaf2: 'imagens/olhos prateados.jpg',
    utopia: 'imagens/Utopia.jpg', godzilla: 'imagens/godzilla.jpg', banana: 'imagens/banana.jpg',
    neymar: 'imagens/neymar.jpg', lusiadas: 'imagens/lusiadas.jpg',
    domcasmurro: 'imagens/Dom casmurro.jpg', futebol: 'imagens/Futebol hsitoria.jpg'
  };
  
  grid.innerHTML = biblioteca.map(item => {
    const expiracao = item.dataExpiracao ? new Date(item.dataExpiracao) : null;
    const expirado = expiracao && expiracao < new Date();
    const status = item.tipo === 'rent' 
      ? (expirado ? '⏰ Expirado' : `📖 Alugado até ${expiracao.toLocaleDateString()}`)
      : '✅ Comprado';
    
    return `
    <div class="book-card" onclick="irParaDetalhes('${item.livroId}')">
      <div class="bc-cover">
        <img class="real-cover" src="${COVERS[item.livroId] || 'imagens/open logo.png'}" alt="${item.titulo}"/>
        <div class="book-status">${status}</div>
      </div>
      <div class="bc-info">
        <h3>${item.titulo}</h3>
        <p>${item.tipo === 'rent' ? 'Alugado' : 'Comprado'}</p>
        <div class="bc-price">R$ ${item.preco.toFixed(2).replace('.',',')}</div>
      </div>
    </div>`;
  }).join('');
}

// Adicionar CSS para o status do livro
const style = document.createElement('style');
style.textContent = `
  .book-status {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,0.7);
    color: var(--gold);
    font-size: 9px;
    padding: 4px;
    text-align: center;
    backdrop-filter: blur(4px);
  }
`;
document.head.appendChild(style);

// Atualizar o DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  renderFavoritos();
  filtrarLivros();
  renderBiblioteca();
});