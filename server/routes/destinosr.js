const express = require("express");
const router = express.Router();
const Destino = require("../models/destinor");

// Obtener todos
router.get("/", async (req, res) => {
  try {
    const destinos = await Destino.find();
    res.json(destinos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear nuevo destino
router.post("/", async (req, res) => {
  try {
    const destino = await Destino.create(req.body);
    res.json(destino);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar destino
router.put("/:id", async (req, res) => {
  try {
    const destino = await Destino.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    });
    res.json(destino);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar destino
router.delete("/:id", async (req, res) => {
  try {
    await Destino.findByIdAndDelete(req.params.id);
    res.json({ message: "Destino eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
