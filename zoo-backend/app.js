require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./config/db'); // Importa la conexión desde db.js


const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());


// Rutas
const animalRoutes = require('./routes/animales');
const paymentRoutes = require('./routes/payments');
const notificationRoutes = require('./routes/notifications');

app.use('/api/animals', animalRoutes); // Ruta base para animales
app.use('/api/payments', paymentRoutes); // Ruta base para pagos
app.use('/api/notifications', notificationRoutes); // Ruta base para notificaciones

// Endpoint para probar la conexión y listar tablas
app.get('/test-db', (req, res) => {
  const query = 'SELECT * FROM Especie'; // Consulta simple para listar tablas
  db.query(query, (err, results) => {
      if (err) {
          console.error('Error ejecutando la consulta:', err);
          return res.status(500).json({ error: 'Error conectando a la base de datos' });
      }
      res.json({ message: 'Conexión exitosa', tables: results });
  });
});

// Endpoint para crear una especie
app.post('/especies', (req, res) => {
  const { idEspecie, nombreComun, nombreCientifico, clase, habitat, descripcion } = req.body;

  const query = `
      INSERT INTO Especie (idEspecie, nombreComun, nombreCientifico, clase, habitat, descripcion)
      VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [idEspecie, nombreComun, nombreCientifico, clase, habitat, descripcion];

  db.query(query, values, (err, results) => {
      if (err) {
          console.error('Error al insertar especie:', err);
          return res.status(500).json({ error: 'Error al insertar especie' });
      }
      res.json({ message: 'Especie creada exitosamente', id: results.insertId });
  });
});

// Endpoint para guardar mensajes
app.post('/messages', (req, res) => {
  const { email, message } = req.body;

  if (!email || !message) {
      return res.status(400).json({ error: 'Email y mensaje son obligatorios' });
  }

  const query = `
      INSERT INTO Mensajes (email, mensaje)
      VALUES (?, ?)
  `;
  const values = [email, message];

  db.query(query, values, (err, results) => {
      if (err) {
          console.error('Error al guardar el mensaje:', err);
          return res.status(500).json({ error: 'Error al guardar el mensaje en la base de datos' });
      }
      res.json({ message: 'Mensaje guardado exitosamente', id: results.insertId });
  });
});


// Endpoint para almacenar un pago
app.post('/payments', (req, res) => {
    const { cantidad_pagada, correo_usuario, descripcion } = req.body;

    if (!cantidad_pagada || !correo_usuario || !descripcion) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const query = `
        INSERT INTO Pagos (cantidad_pagada, correo_usuario, descripcion)
        VALUES (?, ?, ?)
    `;
    const values = [cantidad_pagada, correo_usuario, descripcion];

    db.query(query, values, (err, results) => {
        if (err) {
            console.error('Error al guardar el pago:', err);
            return res.status(500).json({ error: 'Error al guardar el pago' });
        }
        res.status(201).json({ message: 'Pago almacenado con éxito', id_pago: results.insertId });
    });
});

// Endpoint para almacenar una reserva
app.post('/reservations', (req, res) => {
    const { cantidad_pagada, correo_usuario, descripcion, fecha_reserva } = req.body;

    if (!cantidad_pagada || !correo_usuario || !descripcion || !fecha_reserva) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const query = `
        INSERT INTO Reservas (cantidad_pagada, correo_usuario, descripcion, fecha_reserva)
        VALUES (?, ?, ?, ?)
    `;
    const values = [cantidad_pagada, correo_usuario, descripcion, fecha_reserva];

    db.query(query, values, (err, results) => {
        if (err) {
            console.error('Error al guardar la reserva:', err);
            return res.status(500).json({ error: 'Error al guardar la reserva' });
        }
        res.status(201).json({ message: 'Reserva almacenada con éxito', id_reserva: results.insertId });
    });
});


// Servidor
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
