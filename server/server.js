//server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors({
  origin: [
    "https://vuelaya-gamma.vercel.app/", // 👈 coloca aquí el dominio de Vercel
    "http://localhost:3000"
  ],
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));

app.use(express.json());

// Puerto
const PORT = process.env.PORT || 5000;

// Conexión MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB Atlas"))
  .catch((err) => console.error("❌ Error al conectar a MongoDB:", err));

// Rutas
app.use("/usuarios", require("./routes/usuarios"));
app.use("/reservaciones", require("./routes/reservaciones"));
app.use("/destinos", require("./routes/destinosr"));
app.use("/notificaciones", require("./routes/notificaciones"));

// Ruta principal
app.get("/", (req, res) => {
  res.send("Servidor y base de datos conectados correctamente ✅");
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
