const express = require("express");
const router = express.Router();
const Usuario = require("../models/usuario");
const jwt = require("jsonwebtoken");

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { correo, password } = req.body;

    const user = await Usuario.findOne({ correo });
    if (!user) {
      return res.status(400).json({ error: "Usuario no encontrado" });
    }

    if (user.password !== password) {
      return res.status(400).json({ error: "Contraseña incorrecta" });
    }

    // Crear token con el ID del usuario
    const token = jwt.sign(
      { id: user._id, correo: user.correo },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login exitoso",
      token,
      usuario: user,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;