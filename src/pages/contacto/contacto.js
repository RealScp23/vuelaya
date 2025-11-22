// src/pages/contacto/contacto.js
import React, { useState } from "react";
import "./contacto.css";

function Contacto() {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    mensaje: "",
  });

  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.nombre || !form.correo || !form.mensaje) {
      alert("Por favor completa todos los campos.");
      return;
    }

    setEnviado(true);
    setForm({ nombre: "", correo: "", mensaje: "" });

    setTimeout(() => setEnviado(false), 2500);
  };

  return (
    <div className="contacto-container">
      <h1>Contacto</h1>
      <p className="contacto-sub">
        Si tienes dudas sobre reservaciones o vuelos, ¡estamos aquí para ayudarte!
      </p>

      <div className="contacto-content">
        <div className="contacto-info">
          <h2>📞 Información de contacto</h2>
          <p><strong>Teléfono:</strong> +52 55 1234 5678</p>
          <p><strong>Correo:</strong> soporte@vuelaya.com</p>
          <p><strong>Horario:</strong> Lunes a Viernes · 9:00 AM - 6:00 PM</p>
          <p>También puedes enviarnos un mensaje directo usando el formulario.</p>
        </div>

        <form className="contacto-form" onSubmit={handleSubmit}>
          <h2>✉️ Envíanos un mensaje</h2>

          <input
            type="text"
            name="nombre"
            placeholder="Tu nombre"
            value={form.nombre}
            onChange={handleChange}
          />

          <input
            type="email"
            name="correo"
            placeholder="Tu correo"
            value={form.correo}
            onChange={handleChange}
          />

          <textarea
            name="mensaje"
            placeholder="Escribe tu mensaje..."
            value={form.mensaje}
            onChange={handleChange}
          ></textarea>

          <button type="submit">Enviar</button>

          {enviado && <p className="mensaje-enviado">¡Mensaje enviado correctamente!</p>}
        </form>
      </div>
    </div>
  );
}

export default Contacto;
