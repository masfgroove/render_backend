const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Tente este link ajustado (usuário correto do seu print)
const mongoURI = "mongodb+srv://masfgroove2012_db_user:Uesm2026@cluster0.w1odaqz.mongodb.net/uesm?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
  .then(() => console.log("✅ UESM conectada ao MongoDB Atlas!"))
  .catch(err => console.error("❌ Erro ao conectar no banco:", err));

// Criando o "Molde" dos dados (Schema)
const Evento = mongoose.model('Evento', {
  nome: String,
  escola: String,
  ano: Number
});

// --- ROTAS DA API ---

// Rota inicial
app.get('/', (req, res) => {
  res.send('API da UESM rodando com MongoDB! 🚀');
});

// Rota de Eventos (Agora buscando do Banco de Dados real)
app.get('/eventos', async (req, res) => {
  try {
    const eventosDoBanco = await Evento.find();
    res.json(eventosDoBanco);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar dados no banco" });
  }
});

// Rota temporária para você CRIAR o primeiro evento via navegador
// Depois de rodar, acesse: localhost:3000/criar-teste
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