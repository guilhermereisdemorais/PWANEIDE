// ================================================================
//  OPEN LEAF — server.js (MongoDB Atlas)
// ================================================================

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ========== CONEXÃO MONGODB ATLAS ==========
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://DanielFaleia:delmpqos@openleaf.gahzqo2.mongodb.net/?appName=OpenLeaf';

console.log('📊 Conectando ao MongoDB Atlas...');

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB Atlas conectado com sucesso!'))
  .catch(err => {
    console.error('❌ Erro ao conectar no MongoDB:');
    console.error(`   Mensagem: ${err.message}`);
    console.error('\n💡 DICAS:');
    console.error('   1. Verifique se o usuário/senha estão corretos');
    console.error('   2. Verifique se o IP está liberado (0.0.0.0/0)');
    console.error('   3. Verifique a string de conexão no .env');
  });

// ========== SCHEMA E MODEL ==========
const UsuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha_hash: { type: String, required: true },
  criado_em: { type: Date, default: Date.now }
});

const Usuario = mongoose.model('Usuario', UsuarioSchema);

// ========== ROTAS DA API ==========

// Health check
app.get('/api/health', async (req, res) => {
  const estado = mongoose.connection.readyState === 1 ? 'conectado' : 'desconectado';
  res.json({ status: estado === 'conectado' ? 'ok' : 'erro', banco: estado });
});

// Cadastro
app.post('/api/auth/register', async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Preencha todos os campos.' });
  }
  if (senha.length < 6) {
    return res.status(400).json({ erro: 'Senha deve ter pelo menos 6 caracteres.' });
  }

  try {
    // Verifica se usuário já existe
    const existe = await Usuario.findOne({ email });
    if (existe) {
      return res.status(400).json({ erro: 'E-mail já cadastrado.' });
    }

    // Criptografa senha
    const hash = await bcrypt.hash(senha, 10);
    
    // Cria usuário
    const usuario = await Usuario.create({
      nome: nome.trim(),
      email: email.trim(),
      senha_hash: hash
    });

    res.status(201).json({
      mensagem: 'Conta criada com sucesso!',
      usuario: { id: usuario._id, nome: usuario.nome, email: usuario.email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Preencha e-mail e senha.' });
  }

  try {
    // Busca usuário
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
    }

    // Verifica senha
    const ok = await bcrypt.compare(senha, usuario.senha_hash);
    if (!ok) {
      return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
    }

    res.json({
      mensagem: 'Login realizado!',
      usuario: { id: usuario._id, nome: usuario.nome, email: usuario.email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
});

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════╗
  ║     📚 OPEN LEAF RODANDO        ║
  ║                                  ║
  ║  ➜ http://localhost:${PORT}      ║
  ║  ➜ API: /api/health             ║
  ║  ➜ Banco: MongoDB Atlas          ║
  ╚══════════════════════════════════╝
  `);
});