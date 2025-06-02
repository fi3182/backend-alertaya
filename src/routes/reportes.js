const express = require('express');
const router = express.Router();
const { getReportes, crearReporte } = require('../controllers/reportes.controller');
const db = require('../config/db');
const verifyToken = require('../middlewares/auth.middleware');

// GET, POST /api/reportes
router.get('/', getReportes);
router.post('/', crearReporte);

router.post('/', verifyToken, (req, res) => {
    const { descripcion, lat, lng, ciudad, fechaHora, categoria } = req.body;

    // Puedes acceder a req.user.id si necesitas vincular reporte con el usuario

    const sql = 'INSERT INTO reportes (descripcion, lat, lng, ciudad, fechaHora, enviado, categoria) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const valores = [descripcion, lat, lng, ciudad, fechaHora, true, categoria];

    db.query(sql, valores, (err, result) => {
        if (err) {
            console.error('Error al insertar reporte:', err);
            return res.status(500).json({ error: 'Error al insertar reporte' });
        }

        res.status(201).json({ mensaje: 'Reporte registrado correctamente' });
    });
});

module.exports = router;
