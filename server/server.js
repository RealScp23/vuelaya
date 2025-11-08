// Importaciones
require("dotenv").config(); // Para leer variables del .env
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // 👈 Agregado

const app = express();

// Middleware
app.use(cors()); // 👈 Permite que el frontend (React) se comunique
app.use(express.json()); // Para poder leer JSON en las peticiones

// Puerto del servidor
const PORT = process.env.PORT || 5000;

// Conexión con MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB Atlas"))
  .catch((err) => console.error("❌ Error al conectar a MongoDB:", err));

// Rutas
app.use("/usuarios", require("./routes/usuarios"));

// Ruta principal
app.get("/", (req, res) => {
  res.send("Servidor y base de datos conectados correctamente ✅");
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
