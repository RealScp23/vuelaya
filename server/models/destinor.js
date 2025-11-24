const mongoose = require("mongoose");

const destinoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    descripcion: { type: String, required: false },
    origen: { type: String, required: true },
    destino: { type: String, required: true },
    fecha_salida: { type: String, required: true },
    pasajeros: { type: Number, required: true },
    hora_salida: { type: String, required: true },
    aerolinea: { type: String, required: true },
    precio: { type: Number, required: true },
    duracion: { type: String, required: true },
    image: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Destino", destinoSchema);
