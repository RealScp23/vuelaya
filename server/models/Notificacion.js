const mongoose = require("mongoose");

const NotificacionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    mensaje: {
      type: String,
      required: true,
    },
    leida: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notificacion", NotificacionSchema);
