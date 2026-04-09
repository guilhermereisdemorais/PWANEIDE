// ================================================================
//  OPEN LEAF — server.js (PWA simplificado, sem banco)
// ================================================================

const express = require('express');
const path = require('path');
const app = express();
const PORT = 3001;

// Servir arquivos estáticos
app.use(express.static('public'));

// Rotas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'biblioteca.html'));
});

app.get('/biblioteca.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'biblioteca.html'));
});

app.get('/loja.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'loja.html'));
});

app.get('/perfil.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'perfil.html'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/detalhes.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'detalhes.html'));
});

// Servir manifest e sw
app.get('/manifest.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'manifest.json'));
});

app.get('/sw.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sw.js'));
});

// Iniciar
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════╗
  ║     📚 OPEN LEAF PWA            ║
  ║                                  ║
  ║  ➜ http://localhost:${PORT}      ║
  ║  ➜ Instalável no celular!       ║
  ╚══════════════════════════════════╝
  `);
});