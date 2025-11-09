const express = require("express");
const Usuario = require("../models/usuario");
const router = express.Router();

// Obtener todos los usuarios
router.get("/", async (req, res) => {
  const usuarios = await Usuario.find();
  res.json(usuarios);
});

// Registrar usuario
router.post("/registro", async (req, res) => {
  try {
    const nuevoUsuario = new Usuario(req.body);
    await nuevoUsuario.save();
    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Iniciar sesión
router.post("/login", async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    const usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    if (usuario.contraseña !== contraseña) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    // Si todo está bien:
    res.json({
      message: `Bienvenido ${usuario.nombre}`,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

module.exports = router;
