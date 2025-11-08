import React, { useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const [isRegister, setIsRegister] = useState(true); // true = registro, false = login
  const [formData, setFormData] = useState({ nombre: "", correo: "", contraseña: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔥 NUEVO: función que se conecta al servidor Express
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegister) {
      // --- REGISTRO ---
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
          setIsRegister(false); // cambiar a pantalla de login
        } else {
          setMessage(`❌ Error: ${data.error || "No se pudo registrar"}`);
        }
      } catch (error) {
        setMessage("❌ Error de conexión con el servidor");
      }

    } else {
      // --- LOGIN ---
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
          setMessage(`Bienvenido ${data.usuario.nombre}`);
          // 🔐 Aquí podrías guardar el usuario o token en localStorage
          navigate("/home");
        } else {
          setMessage(data.error || "Credenciales incorrectas");
        }
      } catch (error) {
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
          <button type="submit">{isRegister ? "Registrarse" : "Iniciar Sesión"}</button>
        </form>

        <p
          className="toggle-link"
          onClick={() => {
            setIsRegister(!isRegister);
            setMessage("");
          }}
        >
          {isRegister ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Regístrate"}
        </p>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default Login;
