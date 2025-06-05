const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');

const app = express();

// Configuración de CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // URL de tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Permite el envío de cookies y headers de autenticación
};

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.error("Error al conectar a MongoDB:", err));

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
