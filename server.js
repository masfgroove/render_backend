const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// rota teste
app.get('/', (req, res) => {
  res.send('API rodando 🚀');
});

// rota exemplo
app.get('/eventos', (req, res) => {
  res.json([
    { id: 1, nome: "Carnaval RJ" },
    { id: 2, nome: "Carnaval SP" }
  ]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor rodando"));