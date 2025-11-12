// src/pages/login/login.js
import React, { useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const [isRegister, setIsRegister] = useState(true);
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    contraseña: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // usar contexto

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegister) {
      // --- Registro ---
      if (!formData.nombre || !formData.correo || !formData.contraseña) {
        setMessage("Todos los campos son obligatorios");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/usuarios/registro", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();

        if (res.ok) {
          setMessage("✅ Usuario registrado correctamente");
          setFormData({ nombre: "", correo: "", contraseña: "" });
          setIsRegister(false);
        } else setMessage(data.error || "Error al registrar");
      } catch {
        setMessage("❌ Error de conexión con el servidor");
      }
    } else {
      // --- Login ---
      if (!formData.correo || !formData.contraseña) {
        setMessage("Ingresa tu correo y contraseña");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/usuarios/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();

        if (res.ok) {
          login(data.usuario); // ✅ guarda usuario en contexto
          navigate("/home"); // redirige al home
        } else setMessage(data.error || "Credenciales incorrectas");
      } catch {
        setMessage("❌ Error de conexión con el servidor");
      }
    }
  };

  return (
    <div className="login-page">
      <div className={`login-card ${isRegister ? "register" : "login"}`}>
        <h2>{isRegister ? "Registro" : "Iniciar Sesión"}</h2>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={handleChange}
            />
          )}
          <input
            type="email"
            name="correo"
            placeholder="Correo"
            value={formData.correo}
            onChange={handleChange}
          />
          <input
            type="password"
            name="contraseña"
            placeholder="Contraseña"
            value={formData.contraseña}
            onChange={handleChange}
          />
          <button type="submit">
            {isRegister ? "Registrarse" : "Iniciar Sesión"}
          </button>
        </form>

        <p
          className="toggle-link"
          onClick={() => {
            setIsRegister(!isRegister);
            setMessage("");
          }}
        >
          {isRegister
            ? "¿Ya tienes cuenta? Inicia sesión"
            : "¿No tienes cuenta? Regístrate"}
        </p>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default Login;
