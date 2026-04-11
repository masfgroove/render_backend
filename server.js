const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Link do MongoDB Atlas
const mongoURI = "mongodb+srv://masfgroove2012_db_user:Uesm2026@cluster0.w1odaqz.mongodb.net/uesm?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
  .then(() => console.log("✅ UESM conectada ao MongoDB Atlas!"))
  .catch(err => console.error("❌ Erro ao conectar no banco:", err));

// --- MODELOS (SCHEMAS) ---

// Molde para Acessos (IPs)
const Acesso = mongoose.model('Acesso', {
  ip: String,
  data: { type: Date, default: Date.now },
  navegador: String
}, 'acessos');

// Molde para Eventos
const Evento = mongoose.model('Evento', {
  nome: String,
  escola: String,
  ano: Number
});

// Molde para Produtos
const Produto = mongoose.model('Produto', {
  titulo: String,
  preco: String,
  parcelas: String,
  imagem: String,
  descricao: String,
  linkAfiliado: String,
  categoria: String,
  garantia: String
}, 'produtos');

// --- ROTAS DA API ---

// Rota inicial
app.get('/', (req, res) => {
  res.send('API da UESM rodando com MongoDB! 🚀');
});

// 1. ROTA PARA SALVAR ACESSO (O React vai chamar essa)
app.post('/acessos', async (req, res) => {
  try {
    const novoAcesso = new Acesso(req.body);
    await novoAcesso.save();
    res.status(201).json({ mensagem: "Acesso registrado!" });
  } catch (err) {
    res.status(400).json({ error: "Erro ao registrar acesso" });
  }
});

// 2. ROTA PARA VER ACESSOS (Para você consultar quem entrou)
app.get('/ver-acessos', async (req, res) => {
  try {
    const lista = await Acesso.find().sort({ data: -1 });
    res.json(lista);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar acessos" });
  }
});

// Rota de Produtos
app.get('/produtos', async (req, res) => {
  try {
    const produtosDoBanco = await Produto.find();
    res.json(produtosDoBanco);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
});

// Rota de Eventos
app.get('/eventos', async (req, res) => {
  try {
    const eventosDoBanco = await Evento.find();
    res.json(eventosDoBanco);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar eventos" });
  }
});

// Rota de Teste
app.get('/criar-teste', async (req, res) => {
  try {
    const novoEvento = new Evento({
      nome: "Desfile de Maquetes 2026",
      escola: "União das Escolas de Samba de Maquete",
      ano: 2026
    });
    await novoEvento.save();
    res.send("Evento de teste criado com sucesso no MongoDB! 🎉");
  } catch (err) {
    res.send("Erro ao criar: " + err);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));