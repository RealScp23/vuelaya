// routes/reservaciones.js
const express = require("express");
const router = express.Router();
const Reservacion = require("../models/reservacion");

// ✅ Crear nueva reservación
router.post("/", async (req, res) => {
  console.log("📩 Datos recibidos en backend:", req.body); // 👈 Log para depuración

  try {
    // Crear la nueva reserva con los datos recibidos del frontend
    const nuevaReserva = new Reservacion(req.body);
    const guardada = await nuevaReserva.save();
    res.status(201).json(guardada);
  } catch (error) {
    console.error("❌ Error al crear reservación:", error);
    res.status(400).json({ error: error.message });
  }
});

// ✅ Obtener todas las reservaciones
router.get("/", async (req, res) => {
  try {
    const reservaciones = await Reservacion.find().sort({ createdAt: -1 });
    res.json(reservaciones);
  } catch (error) {
    console.error("❌ Error al obtener reservaciones:", error);
    res.status(500).json({ error: "Error al obtener reservaciones" });
  }
});

// ✅ Obtener una reservación por ID
router.get("/:id", async (req, res) => {
  try {
    const reserva = await Reservacion.findById(req.params.id);
    if (!reserva) {
      return res.status(404).json({ error: "Reservación no encontrada" });
    }
    res.json(reserva);
  } catch (error) {
    console.error("❌ Error al buscar reservación:", error);
    res.status(500).json({ error: "Error al buscar la reservación" });
  }
});

// ✅ Actualizar reservación
router.put("/:id", async (req, res) => {
  try {
    const actualizada = await Reservacion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!actualizada) {
      return res.status(404).json({ error: "Reservación no encontrada" });
    }
    res.json(actualizada);
  } catch (error) {
    console.error("❌ Error al actualizar reservación:", error);
    res.status(400).json({ error: error.message });
  }
});

// ✅ Eliminar reservación
router.delete("/:id", async (req, res) => {
  try {
    const eliminada = await Reservacion.findByIdAndDelete(req.params.id);
    if (!eliminada) {
      return res.status(404).json({ error: "Reservación no encontrada" });
    }
    res.json({ message: "Reservación eliminada correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar reservación:", error);
    res.status(500).json({ error: "Error al eliminar la reservación" });
  }
});

module.exports = router;