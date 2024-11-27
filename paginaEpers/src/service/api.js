import axios from 'axios';

const express = require('express');
const app = express();

app.use(express.json());

app.post('/influxdb/alerts', (req, res) => {
    const alerta = req.body; // Aquí recibes la notificación
    console.log('Alerta recibida:', alerta);
    res.status(200).send('Alerta procesada');
});

app.listen(3000, () => {
    console.log('Servidor escuchando en http://localhost:3000');
})