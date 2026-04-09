// ── CARRINHO — funções compartilhadas ────────────────────────

function atualizarBadge() {
  const cart = JSON.parse(localStorage.getItem('ol_cart') || '[]');
  const total = cart.length;
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = total;
    el.style.display = total > 0 ? 'flex' : 'none';
  });
}

function irParaDetalhes(id) {
  window.location.href = `detalhes.html?id=${id}`;
}

// ── FINALIZAR COMPRA (salva na biblioteca do usuário) ─────────
async function finalizarCompra() {
  const cart = JSON.parse(localStorage.getItem('ol_cart') || '[]');
  const user = JSON.parse(localStorage.getItem('ol_user') || '{}');
  
  if (cart.length === 0) {
    showToastLocal('Carrinho vazio!', 'warning');
    return;
  }
  
  if (!user.id) {
    showToastLocal('Faça login para comprar!', 'error');
    setTimeout(() => window.location.href = 'login.html', 1500);
    return;
  }

  showToastLocal('Processando compra...', 'loading');

  try {
    // Salva cada item na biblioteca do usuário
    for (const item of cart) {
      const dataExpiracao = item.tipo === 'rent' 
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 dias
        : null;

      const res = await fetch(`/api/biblioteca/${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          livroId: item.id,
          titulo: item.titulo,
          tipo: item.tipo,
          preco: item.preco,
          dataExpiracao
        })
      });
      
      if (!res.ok) throw new Error('Erro ao salvar');
    }

    // Limpa o carrinho
    localStorage.removeItem('ol_cart');
    atualizarBadge();
    
    // Atualiza a biblioteca na página se estiver nela
    if (typeof renderBiblioteca === 'function') renderBiblioteca();
    
    showToastLocal(`✅ Compra finalizada! ${cart.length} livro(s) adicionado(s) à sua biblioteca.`, 'success');
    
    // Recarrega a página da biblioteca se estiver nela
    if (window.location.pathname.includes('biblioteca.html')) {
      setTimeout(() => location.reload(), 2000);
    }
  } catch (err) {
    showToastLocal('Erro na compra. Tente novamente.', 'error');
  }
}

// ── BUSCAR BIBLIOTECA DO USUÁRIO ──────────────────────────────
async function carregarBiblioteca() {
  const user = JSON.parse(localStorage.getItem('ol_user') || '{}');
  if (!user.id) return [];
  
  try {
    const res = await fetch(`/api/biblioteca/${user.id}`);
    const data = await res.json();
    return data.biblioteca || [];
  } catch (err) {
    return [];
  }
}

// ── TOAST LOCAL ───────────────────────────────────────────────
function showToastLocal(msg, tipo = 'info') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  if (tipo === 'error') t.style.background = 'var(--red)';
  else if (tipo === 'success') t.style.background = 'var(--green)';
  else t.style.background = 'var(--gold)';
  setTimeout(() => {
    t.classList.remove('show');
    t.style.background = 'var(--gold)';
  }, 2800);
}

// Aplica ao carregar
document.addEventListener('DOMContentLoaded', () => {
  atualizarBadge();
  const user = JSON.parse(localStorage.getItem('ol_user') || '{}');
  document.querySelectorAll('.nav-avatar, #navAvatar').forEach(el => {
    el.textContent = user.nome ? user.nome.charAt(0).toUpperCase() : 'U';
  });
});