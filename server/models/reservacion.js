const mongoose = require("mongoose");

const reservacionSchema = new mongoose.Schema({
  vueloId: { type: String, required: true },
  usuarioId: { type: String, required: true },  // ✔ MUY IMPORTANTE
  nombre: { type: String, required: true },
  email: { type: String },
  telefono: { type: String },
  pasajeros: { type: Number, default: 1 },
  asiento: { type: String },
  precio_total: { type: Number },
  aerolinea: { type: String },
  fecha_salida: { type: String },
  hora_salida: { type: String },
  descripcion: { type: String },

  payment: {
    status: { type: String },
    cardLast4: { type: String },
    method: { type: String }
  }
});

module.exports = mongoose.model("Reservacion", reservacionSchema);
