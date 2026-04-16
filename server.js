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

const Acesso = mongoose.model('Acesso', {
  ip: String,
  data: { type: Date, default: Date.now },
  navegador: String
}, 'acessos');

const Evento = mongoose.model('Evento', {
  nome: String,
  escola: String,
  ano: Number
}, 'eventos');

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

const NoticiaUESM = mongoose.model('NoticiaUESM', {
  titulo: String,
  subtitulo: String,
  conteudo: String, 
  imagem: String,
  categoria: String,
  data: { type: Date, default: Date.now }
}, 'noticias_uesm');

// --- ROTAS DA API ---

app.get('/', (req, res) => {
  res.send('API da UESM rodando com MongoDB! 🚀');
});

// 1. ROTAS DE ACESSOS
app.post('/acessos', async (req, res) => {
  try {
    const novoAcesso = new Acesso(req.body);
    await novoAcesso.save();
    res.status(201).json({ mensagem: "Acesso registrado!" });
  } catch (err) {
    res.status(400).json({ error: "Erro ao registrar acesso" });
  }
});

app.get('/ver-acessos', async (req, res) => {
  try {
    const lista = await Acesso.find().sort({ data: -1 });
    const listaFormatada = lista.map(item => ({
      ip: item.ip,
      navegador: item.navegador,
      dataOriginal: item.data,
      dataLocal: item.data.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
    }));
    res.json(listaFormatada);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar acessos" });
  }
});

// 2. ROTAS DE PRODUTOS
app.get('/produtos', async (req, res) => {
  try {
    const produtosDoBanco = await Produto.find();
    res.json(produtosDoBanco);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
});

app.post('/produtos', async (req, res) => {
  try {
    const novoProduto = new Produto(req.body);
    await novoProduto.save();
    res.status(201).json({ mensagem: "Produto cadastrado com sucesso!" });
  } catch (err) {
    res.status(400).json({ error: "Erro ao cadastrar produto" });
  }
});

// 3. ROTAS: NOTÍCIAS UESM (CORRIGIDAS)

// ROTA A: Lista todas as notícias
app.get('/noticias-uesm', async (req, res) => {
  try {
    const noticias = await NoticiaUESM.find().sort({ data: -1 });
    res.json(noticias);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar lista de notícias" });
  }
});

// ROTA B: Busca UMA notícia específica por ID (ESSENCIAL PARA A PÁGINA ABRIR)
app.get('/noticias-uesm/:id', async (req, res) => {
  try {
    const noticia = await NoticiaUESM.findById(req.params.id);
    if (!noticia) return res.status(404).json({ error: "Notícia não encontrada" });
    res.json(noticia);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar detalhe da notícia" });
  }
});

app.post('/noticias-uesm', async (req, res) => {
  try {
    const novaNoticia = new NoticiaUESM(req.body);
    await novaNoticia.save();
    res.status(201).json({ mensagem: "Notícia UESM cadastrada com sucesso!" });
  } catch (err) {
    res.status(400).json({ error: "Erro ao cadastrar notícia" });
  }
});

app.put('/noticias-uesm/:id', async (req, res) => {
  try {
    await NoticiaUESM.findByIdAndUpdate(req.params.id, req.body);
    res.json({ mensagem: "Notícia atualizada! 🔄" });
  } catch (err) {
    res.status(400).json({ error: "Erro ao atualizar notícia" });
  }
});

app.delete('/noticias-uesm/:id', async (req, res) => {
  try {
    await NoticiaUESM.findByIdAndDelete(req.params.id);
    res.json({ mensagem: "Notícia removida! 🗑️" });
  } catch (err) {
    res.status(400).json({ error: "Erro ao excluir notícia" });
  }
});

// 4. ROTAS DE EVENTOS
app.get('/eventos', async (req, res) => {
  try {
    const eventosDoBanco = await Evento.find();
    res.json(eventosDoBanco);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar eventos" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));