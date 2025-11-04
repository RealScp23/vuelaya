import React from "react";
import { useNavigate } from "react-router-dom";
import "./presentation.css";

function Presentation() {
  const navigate = useNavigate();

  return (
    <div className="presentation-container">
      <header className="presentation-header">
        <h2>VuelaYa</h2>
      </header>

      <div className="presentation-content">
        <h1>Descubre México.</h1>
        <p>Tu travesía comienza aquí</p>
        <button onClick={() => navigate("/login")}>RESERVA TU VUELO</button>
      </div>
    </div>
  );
}

export default Presentation;
