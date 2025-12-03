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
    numero: "",
    direccion: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // Contexto

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegister) {
      // --- Registro ---
      if (!formData.nombre || !formData.correo || !formData.contraseña || !formData.numero || !formData.direccion) {
        setMessage("Todos los campos son obligatorios");
        return;
      }

      try {
        const res = await fetch("https://vuelaya-jhfa.onrender.com/usuarios/registro", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (res.ok) {
          setMessage("✅ Usuario registrado correctamente");
          setFormData({ nombre: "", correo: "", contraseña: "", numero: "", direccion: "" });
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
        const res = await fetch("https://vuelaya-jhfa.onrender.com/usuarios/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (res.ok) {
          // ✅ Guardar token y usuario en localStorage
          localStorage.setItem("token", data.token);
          localStorage.setItem("usuario", JSON.stringify(data.usuario));

          login(data.usuario);
          navigate("/home");
        } else setMessage(data.error || "Credenciales incorrectas");
      } catch {
        setMessage("❌ Error de conexión con el servidor");
      }
    }
  };

  return (
    <div className="login-page">
      <div className={`login-card ${isRegister ? "registro" : "login"}`}>
        <h2>{isRegister ? "Registro" : "Iniciar Sesión"}</h2>
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} />
              <input type="text" name="numero" placeholder="Número" value={formData.numero} onChange={handleChange} />
              <input type="text" name="direccion" placeholder="Dirección" value={formData.direccion} onChange={handleChange} />
            </>
          )}
          <input type="email" name="correo" placeholder="Correo" value={formData.correo} onChange={handleChange} />
          <input type="password" name="contraseña" placeholder="Contraseña" value={formData.contraseña} onChange={handleChange} />
          <button type="submit">{isRegister ? "Registrarse" : "Iniciar Sesión"}</button>
        </form>
        <p className="toggle-link" onClick={() => { setIsRegister(!isRegister); setMessage(""); }}>
          {isRegister ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Regístrate"}
        </p>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default Login;