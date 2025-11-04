import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";
import { CalendarToday, FlightTakeoff, People } from "@mui/icons-material";
import { destinationsMock } from "../../assets/mockups/destinationsMock";

function Home() {
  const [destinations, setDestinations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setDestinations(destinationsMock);
    };
    fetchData();
  }, []);

  // Validaciones opcionales
  const handleSearch = () => {
    const origin = document.querySelector('input[placeholder="Origen"]').value.trim();
    const destination = document.querySelector('input[placeholder="Destino"]').value.trim();
    const dates = document.querySelector('input[placeholder="Fechas"]').value.trim();
    const passengers = document.querySelector('input[placeholder="Pasajeros"]').value.trim();

    const lettersRegex = /^[A-Za-z\s]+$/;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (origin && !lettersRegex.test(origin)) {
      alert("Por favor ingresa un origen válido (solo letras).");
      return;
    }

    if (destination && !lettersRegex.test(destination)) {
      alert("Por favor ingresa un destino válido (solo letras).");
      return;
    }

    if (dates && !dateRegex.test(dates)) {
      alert("Por favor ingresa una fecha válida en formato YYYY-MM-DD.");
      return;
    }

    if (passengers && (isNaN(passengers) || parseInt(passengers, 10) < 1)) {
      alert("Por favor ingresa un número válido de pasajeros (mínimo 1).");
      return;
    }

    navigate(`/vuelos?origen=${origin}&destino=${destination}&fecha=${dates}&pasajeros=${passengers}`);
  };

  return (
    <div className="home-page">
      <section className="banner">
        <div className="search-card">
          <h2>Busca tu vuelo</h2>
          <div className="search-form">
            <div className="input-group">
              <FlightTakeoff />
              <input type="text" placeholder="Origen" />
            </div>
            <div className="input-group">
              <FlightTakeoff />
              <input type="text" placeholder="Destino" />
            </div>
            <div className="input-group">
              <CalendarToday />
              <input type="text" placeholder="Fechas" />
            </div>
            <div className="input-group">
              <People />
              <input type="number" placeholder="Pasajeros" min="1" />
            </div>
            <button className="search-btn" onClick={handleSearch}>
              Buscar
            </button>
          </div>
        </div>
      </section>

      <section className="destinations">
        <h3>Vuelos Populares</h3>
        <div className="cards-container">
          {destinations.length > 0 ? (
            destinations.map((dest) => (
              <div key={dest._id} className="destination-card">
                <img src={dest.image} alt={dest.name} />
                <h4>{dest.name}</h4>
                <p>{dest.description}</p>
              </div>
            ))
          ) : (
            <p>Cargando destinos...</p>
          )}
        </div>
      </section>

      <footer>
        <p>© 2025 VuelaYa. Todos los derechos reservados.</p>
        <div className="footer-links">
          <span>Privacidad</span>
          <span>Términos</span>
          <span>Ayuda</span>
        </div>
      </footer>
    </div>
  );
}

export default Home;
