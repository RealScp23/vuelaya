import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Presentation from "./pages/presentation/presentation";
import Login from "./pages/login/login";
import Navbar from "./components/navbar";
import Home from "./pages/home/home";
import Vuelos from "./pages/destinos/destinos";
import Contacto from "./pages/contacto/contacto";
import Cuenta from "./pages/cuenta/cuenta";

function AppWrapper() {
  const location = useLocation();

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
      </Routes>
    </>
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
