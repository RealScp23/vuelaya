const mongoose = require("mongoose");

const UsuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true },
  contraseña: { type: String, required: true },
  numero: { type: String, required: true },
  direccion: { type: String, required: true },
  foto: { type: String, default: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" },
  rol: { type: String, default: "usuario" },
});


module.exports = mongoose.model("Usuario", UsuarioSchema);
