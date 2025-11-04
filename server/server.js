// Importamos Express
const express = require("express");
const app = express();

// Puerto donde escuchará el servidor
const PORT = 5000;

// Datos de ejemplo (simulando una base de datos)
const cuentas = [
  { 
    _id: "1",
    nombre: "Juan Perez",
    correo: "juan@email.com",
    contraseña: "123456",
    rol: "usuario",
    historial_reservaciones: []
  },
  { 
    _id: "2",
    nombre: "María López",
    correo: "maria@email.com",
    contraseña: "abcdef",
    rol: "usuario",
    historial_reservaciones: []
  },
  { 
    _id: "3",
    nombre: "Carlos Ramírez",
    correo: "carlos@email.com",
    contraseña: "654321",
    rol: "admin",
    historial_reservaciones: []
  }
];

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente ✅");
});

// Ruta para mostrar las cuentas (en JSON)
app.get("/cuentas", (req, res) => {
  res.json(cuentas);
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
