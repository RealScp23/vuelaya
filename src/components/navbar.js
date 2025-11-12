// src/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">VuelaYa</div>

      <ul className="nav-links">
        <li><Link to="/home">Inicio</Link></li>
        <li><Link to="/vuelos">Vuelos</Link></li>
        <li><Link to="/contacto">Contacto</Link></li>
        <li><Link to="/cuenta">Cuenta</Link></li>
        <li><Link to="/reservaciones">Reservaciones</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
