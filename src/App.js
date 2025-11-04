// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, useParams } from "react-router-dom";

import Presentation from "./pages/presentation/presentation";
import Login from "./pages/login/login";
import Navbar from "./components/navbar";
import Home from "./pages/home/home";
import Vuelos from "./pages/destinos/destinos";
import Contacto from "./pages/contacto/contacto";
import Cuenta from "./pages/cuenta/cuenta";
import Reservaciones from "./pages/reservaciones/reserva"; // <-- asegúrate de que este path exista

// Utility route component: muestra navbar excepto en rutas listadas
function AppWrapper() {
  const location = useLocation();

  // Rutas donde NO queremos mostrar el navbar
  const noNavbarRoutes = ["/", "/login"];
  const showNavbar = !noNavbarRoutes.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Presentation />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/vuelos" element={<Vuelos />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/cuenta" element={<Cuenta />} />

        {/* Reservaciones: pantalla CRUD + pago simulado */}
        <Route path="/reservaciones" element={<Reservaciones />} />

        {/* Ruta de compatibilidad: /reservacion/:id 
            Redirige a /vuelos y deja state para abrir modal del vuelo */}
        <Route path="/reservacion/:id" element={<ReservacionRedirect />} />

        {/* (Opcional) 404 simple: */}
        <Route path="*" element={<NotFoundFallback />} />
      </Routes>
    </>
  );
}

/* Redirige /reservacion/:id -> /vuelos con state.openModalId
   Esto evita rutas rotas si tu app navega a /reservacion/123 */
function ReservacionRedirect() {
  const { id } = useParams();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!id) {
      navigate("/vuelos", { replace: true });
      return;
    }
    // Navega a /vuelos y solicita abrir modal para el vuelo id
    navigate("/vuelos", { state: { openModalId: Number(id) } });
    // replace true podría evitar historial extra; aquí dejamos por defecto
    // navigate("/vuelos", { replace: true, state: { openModalId: Number(id) } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return null;
}

/* Fallback simple para rutas no encontradas */
function NotFoundFallback() {
  return (
    <div style={{ padding: 40 }}>
      <h2>Página no encontrada</h2>
      <p>La ruta que solicitaste no existe. Ve a <a href="/vuelos">Vuelos</a>.</p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
