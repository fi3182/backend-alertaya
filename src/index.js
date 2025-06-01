const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ Middleware de seguridad y formato JSON
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Rutas principales
const reportesRouter = require('./routes/reportes');
app.use('/api/reportes', reportesRouter);

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🟢 Servidor corriendo en http://0.0.0.0:${PORT}`);
});

