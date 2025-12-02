// src/components/Navbar.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="logo">VuelaYa</div>

      {/* Botón hamburguesa */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <span className={menuOpen ? "line open" : "line"}></span>
        <span className={menuOpen ? "line open" : "line"}></span>
        <span className={menuOpen ? "line open" : "line"}></span>
      </div>

      {/* Menú */}
      <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
        <li><Link to="/home" onClick={() => setMenuOpen(false)}>Inicio</Link></li>
        <li><Link to="/vuelos" onClick={() => setMenuOpen(false)}>Vuelos</Link></li>
        <li><Link to="/contacto" onClick={() => setMenuOpen(false)}>Contacto</Link></li>
        <li><Link to="/cuenta" onClick={() => setMenuOpen(false)}>Cuenta</Link></li>
        <li><Link to="/reservaciones" onClick={() => setMenuOpen(false)}>Reservaciones</Link></li>
        <li><Link to="/notificaciones" onClick={() => setMenuOpen(false)}>Notificaciones</Link></li>

        {user?.rol === "admin" && (
          <li>
            <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin Panel</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
