// src/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user } = useAuth(); // 👈 ahora sí viene del contexto (reactivo)

  return (
    <nav className="navbar">
      <div className="logo">VuelaYa</div>

      <ul className="nav-links">
        <li><Link to="/home">Inicio</Link></li>
        <li><Link to="/vuelos">Vuelos</Link></li>
        <li><Link to="/contacto">Contacto</Link></li>
        <li><Link to="/cuenta">Cuenta</Link></li>
        <li><Link to="/reservaciones">Reservaciones</Link></li>
        <li> <Link to="/notificaciones">Notificaciones</Link></li>

        {/* 🔥 SOLO admin ve esto */}
        {user?.rol === "admin" && (
          <li>
            <Link to="/admin">Admin Panel</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
