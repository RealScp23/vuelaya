// routes/usuarios.js
const express = require("express");
const router = express.Router();
const Usuario = require("../models/usuario");

// ===============================
//     OBTENER TODOS LOS USUARIOS
// ===============================
router.get("/", async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

// ===============================
//     REGISTRO DE USUARIO
// ===============================
router.post("/registro", async (req, res) => {
  try {
    const { nombre, correo, contraseña, numero, direccion } = req.body;

    const nuevoUsuario = new Usuario({
      nombre,
      correo,
      contraseña,
      numero,
      direccion,
      rol: "cliente",
    });

    await nuevoUsuario.save();
    res.json({ mensaje: "Usuario registrado", usuario: nuevoUsuario });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar usuario" });
  }
});

// ===============================
//            LOGIN
// ===============================
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

    // 👉 Crear notificación automática
    const Notificacion = require("../models/Notificacion");

    await Notificacion.create({
      userId: usuario._id,
      mensaje: `Bienvenido ${usuario.nombre}. Revisa los vuelos populares de esta semana.`,
    });

    res.json({
      message: `Bienvenido ${usuario.nombre}`,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        numero: usuario.numero,
        direccion: usuario.direccion,
        foto: usuario.foto,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

// ===============================
//        OBTENER POR ID
// ===============================
router.get("/:id", async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario)
      return res.status(404).json({ error: "Usuario no encontrado" });

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuario" });
  }
});

// ===============================
//        ACTUALIZAR GENERAL
// ===============================
router.put("/:id", async (req, res) => {
  try {
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!usuarioActualizado)
      return res.status(404).json({ error: "Usuario no encontrado" });

    res.json(usuarioActualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ===============================
//     ACTUALIZAR SOLO EL ROL
// ===============================
router.put("/:id/rol", async (req, res) => {
  console.log("📌 PUT /usuarios/:id/rol fue llamado");

  try {
    const { rol } = req.body;

    if (!rol) {
      return res.status(400).json({ error: "El rol es requerido" });
    }

    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      { rol },
      { new: true }
    );

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({
      message: "Rol actualizado correctamente",
      usuario,
    });
  } catch (error) {
    console.error("❌ Error al actualizar rol:", error);
    res.status(400).json({ error: error.message });
  }
});

// ===============================
//        ELIMINAR USUARIO
// ===============================
router.delete("/:id", async (req, res) => {
  try {
    const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);

    if (!usuarioEliminado)
      return res.status(404).json({ error: "Usuario no encontrado" });

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
});

module.exports = router;
