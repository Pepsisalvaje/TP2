const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

// Configuración de CORS
const cors = require('cors');
// Configuración de CORS
app.use(cors());

// Configuración de rutas estáticas
app.use(express.static(path.join(__dirname, 'src')));

// Configuración de la ruta raíz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.get('/getJson', (req, res) => {
    const data = { message: 'Este es un objeto JSON enviado desde el servidor.' };
    let rawdata = fs.readFileSync('build/contracts/Election.json');
    let Election = JSON.parse(rawdata);
    res.json(Election);
  });

// Iniciar el servidor
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});