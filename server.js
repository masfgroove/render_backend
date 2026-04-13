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
});

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

app.get('/', (req, res) => {
  res.send('API da UESM rodando com MongoDB! 🚀');
});

// 1. ROTA PARA SALVAR ACESSO
app.post('/acessos', async (req, res) => {
  try {
    const novoAcesso = new Acesso(req.body);
    await novoAcesso.save();
    res.status(201).json({ mensagem: "Acesso registrado!" });
  } catch (err) {
    res.status(400).json({ error: "Erro ao registrar acesso" });
  }
});

// 2. ROTA PARA VER ACESSOS (COM HORÁRIO DE BRASÍLIA FORMATADO)
app.get('/ver-acessos', async (req, res) => {
  try {
    const lista = await Acesso.find().sort({ data: -1 });
    
    const listaFormatada = lista.map(item => {
      return {
        ip: item.ip,
        navegador: item.navegador,
        dataOriginal: item.data,
        dataLocal: item.data.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
      };
    });

    res.json(listaFormatada);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar acessos" });
  }
});

// 3. ROTAS DE PRODUTOS (BUSCAR E CADASTRAR)
app.get('/produtos', async (req, res) => {
  try {
    const produtosDoBanco = await Produto.find();
    res.json(produtosDoBanco);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
});

// NOVA ROTA: CADASTRAR PRODUTO VIA FORMULÁRIO
app.post('/produtos', async (req, res) => {
  try {
    const novoProduto = new Produto(req.body);
    await novoProduto.save();
    res.status(201).json({ mensagem: "Produto cadastrado com sucesso!" });
  } catch (err) {
    res.status(400).json({ error: "Erro ao cadastrar produto" });
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

// --- ROTAS DE TESTE ---

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

app.get('/teste-acesso', async (req, res) => {
  try {
    const teste = new Acesso({
      ip: "123.456.78.9",
      navegador: "Teste Manual via Navegador",
      data: new Date()
    });
    await teste.save();
    res.send("✅ Sucesso! Acesso de teste gravado. Verifique a coleção 'acessos' no MongoDB Atlas.");
  } catch (err) {
    res.status(500).send("❌ Erro ao gravar teste: " + err);
  }
});

// ROTA PARA ALTERAR PRODUTO PELO ID
app.put('/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const atualizacao = req.body;
    await Produto.findByIdAndUpdate(id, atualizacao);
    res.json({ mensagem: "Produto atualizado com sucesso! 🔄" });
  } catch (err) {
    res.status(400).json({ error: "Erro ao atualizar produto" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));