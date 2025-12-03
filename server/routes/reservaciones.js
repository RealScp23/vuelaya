const express = require("express");
const router = express.Router();
const Reservacion = require("../models/reservacion");

// ✅ Middleware para obtener userId desde el token (si usas JWT)
const auth = require("../middleware/auth");  
// Si NO usas token, te digo más abajo cómo cambiarlo

// ========================================
// 🔹 OBTENER SOLO RESERVACIONES DEL USUARIO
// ========================================
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id; // viene del token

    const reservaciones = await Reservacion.find({ userId });
    res.json(reservaciones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========================================
// 🔹 CREAR RESERVACIÓN (DEL USUARIO)
// ========================================
router.post("/", auth, async (req, res) => {
  try {
    const nuevaReserva = await Reservacion.create({
      ...req.body,
      userId: req.user.id  // guardar al usuario que reservó
    });

    res.json(nuevaReserva);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========================================
// 🔹 ACTUALIZAR RESERVACIÓN
// ========================================
router.put("/:id", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Evitar editar reservas de otros
    const reservacion = await Reservacion.findOneAndUpdate(
      { _id: req.params.id, userId },
      req.body,
      { new: true }
    );

    res.json(reservacion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ========================================
// 🔹 ELIMINAR RESERVACIÓN DEL USUARIO
// ========================================
router.delete("/:id", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    await Reservacion.findOneAndDelete({
      _id: req.params.id,
      userId
    });

    res.json({ message: "Reserva eliminada" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;