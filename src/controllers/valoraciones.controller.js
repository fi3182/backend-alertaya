const db = require('../config/db');

// Crear o actualizar una valoración
const valorarReporte = (req, res) => {
  const { id } = req.params; // ID del reporte
  const { util } = req.body; // true o false
  const usuarioId = req.usuario?.id;

  if (!usuarioId) return res.status(401).json({ error: 'Usuario no autenticado' });

  const buscarSql = 'SELECT * FROM valoraciones WHERE reporteId = ? AND usuarioId = ?';
  db.query(buscarSql, [id, usuarioId], (err, resultados) => {
    if (err) return res.status(500).json({ error: 'Error en BD' });

    if (resultados.length > 0) {
      const valoracionActual = resultados[0];
      if (valoracionActual.util === util) {
        // Desmarcar valoración
        db.query('DELETE FROM valoraciones WHERE id = ?', [valoracionActual.id], (err2) => {
          if (err2) return res.status(500).json({ error: 'Error al eliminar valoración' });
          return res.json({ mensaje: 'Valoración eliminada' });
        });
      } else {
        // Actualizar valoración
        db.query('UPDATE valoraciones SET util = ? WHERE id = ?', [util, valoracionActual.id], (err3) => {
          if (err3) return res.status(500).json({ error: 'Error al actualizar valoración' });
          return res.json({ mensaje: 'Valoración actualizada' });
        });
      }
    } else {
      // Insertar nueva valoración
      const insertSql = 'INSERT INTO valoraciones (usuarioId, reporteId, util) VALUES (?, ?, ?)';
      db.query(insertSql, [usuarioId, id, util], (err4) => {
        if (err4) return res.status(500).json({ error: 'Error al insertar valoración' });
        return res.json({ mensaje: 'Valoración registrada' });
      });
    }
  });
};

// obtener valoracion de usuario 
const obtenerValoracionUsuario = (req, res) => {
  const usuarioId = req.usuario?.id;
  const reporteId = parseInt(req.params.id);

  if (!usuarioId || isNaN(reporteId)) {
    return res.status(400).json({ error: 'Datos inválidos.' });
  }

  const sql = 'SELECT util FROM valoraciones WHERE usuarioId = ? AND reporteId = ?';
  db.query(sql, [usuarioId, reporteId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al consultar valoración.' });
    if (results.length > 0) {
      return res.json({ valorado: true, util: results[0].util === 1 });
    } else {
      return res.json({ valorado: false });
    }
  });
};




// Obtener resumen de valoraciones para un reporte
const obtenerResumenValoraciones = (req, res) => {
  const reporteId = req.params.id;

  const sql = `
    SELECT
      SUM(CASE WHEN valor = 1 THEN 1 ELSE 0 END) AS utiles,
      SUM(CASE WHEN valor = -1 THEN 1 ELSE 0 END) AS no_utiles
    FROM valoraciones
    WHERE reporte_id = ?
  `;

  db.query(sql, [reporteId], (err, results) => {
    if (err) {
      console.error('Error al obtener resumen de valoraciones:', err);
      return res.status(500).json({ error: 'Error al obtener valoraciones' });
    }
    res.status(200).json(results[0]);
  });
};

module.exports = { valorarReporte, obtenerResumenValoraciones, obtenerValoracionUsuario };
