const express = require('express');
const router = express.Router();
const pool = require('../db');

// PUT /api/persons/:id - Actualizar información de una persona
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    first_name,
    last_name,
    alias,
    dob,
    gender,
    nationality,
    observaciones
  } = req.body;

  // Validación básica
  if (!first_name || !last_name) {
    return res.status(400).json({ error: 'Nombre y apellido son requeridos.' });
  }

  try {
    const result = await pool.query(
      `UPDATE Persons SET
        first_name = $1,
        last_name = $2,
        alias = $3,
        dob = $4,
        gender = $5,
        nationality = $6,
        observaciones = $7
      WHERE id = $8
      RETURNING *`,
      [first_name, last_name, alias, dob, gender, nationality, observaciones, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Persona no encontrada.' });
    }

    res.json({
      success: true,
      message: 'Información de la persona actualizada correctamente.',
      person: result.rows[0]
    });

  } catch (err) {
    console.error(`Error al actualizar persona ${id}:`, err.message);
    res.status(500).json({ error: 'Error en el servidor al actualizar la persona.' });
  }
});

// DELETE /api/persons/:id - Eliminar una persona y sus datos asociados
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // La base de datos está configurada con ON DELETE CASCADE,
    // así que al borrar una persona, se borrarán sus arrestos,
    // huellas y datos faciales asociados.
    const deleteOp = await pool.query('DELETE FROM Persons WHERE id = $1 RETURNING *', [id]);

    if (deleteOp.rowCount === 0) {
      return res.status(404).json({ error: 'Persona no encontrada para eliminar.' });
    }

    // Aquí podrías agregar la lógica para eliminar archivos físicos (fotos, etc.) si es necesario.

    res.json({ success: true, message: `Persona con ID ${id} y todos sus datos han sido eliminados.` });
  } catch (err) {
    console.error(`Error al eliminar persona ${id}:`, err.message);
    res.status(500).json({ error: 'Error en el servidor al eliminar la persona.' });
  }
});

module.exports = router;