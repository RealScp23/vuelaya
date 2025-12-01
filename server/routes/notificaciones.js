const express = require("express");
const router = express.Router();
const Notificacion = require("../models/Notificacion");

// Obtener notificaciones de un usuario
router.get("/:userId", async (req, res) => {
  try {
    const notificaciones = await Notificacion.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });

    res.json(notificaciones);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener notificaciones" });
  }
});

// Crear notificación manual (opcional)
router.post("/", async (req, res) => {
  try {
    const { userId, mensaje } = req.body;

    const nueva = new Notificacion({ userId, mensaje });
    await nueva.save();

    res.json(nueva);
  } catch (error) {
    res.status(500).json({ error: "Error al crear notificación" });
  }
});

// Marcar una como leída
router.put("/:id/leida", async (req, res) => {
  try {
    const notif = await Notificacion.findByIdAndUpdate(
      req.params.id,
      { leida: true },
      { new: true }
    );

    res.json(notif);
  } catch (error) {
    res.status(500).json({ error: "Error al marcar como leída" });
  }
});

// Eliminar una notificación
router.delete("/:id", async (req, res) => {
  try {
    await Notificacion.findByIdAndDelete(req.params.id);
    res.json({ message: "Notificación eliminada" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar" });
  }
});

module.exports = router;
