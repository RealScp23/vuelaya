// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";

import Presentation from "./pages/presentation/presentation";
import Login from "./pages/login/login";
import Navbar from "./components/navbar";
import Home from "./pages/home/home";
import Vuelos from "./pages/destinos/destinos";
import Contacto from "./pages/contacto/contacto";
import Cuenta from "./pages/cuenta/cuenta";
import Reservaciones from "./pages/reservaciones/reserva";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AdminPage from "./pages/admin/AdminPage";

// ⭐ IMPORTA NOTIFICACIONES
import Notificaciones from "./pages/notificaciones/Notificaciones";

// ⭐ IMPORTAR TOAST
import Toast from "./components/Toast/Toast";

function AppWrapper() {
  const location = useLocation();
  const noNavbarRoutes = ["/", "/login"];
  const showNavbar = !noNavbarRoutes.includes(location.pathname);

  // ⭐ Usar toast global
  const { toast } = useAuth();

  return (
    <>
      {showNavbar && <Navbar />}

      {/* ⭐ Mostrar toast global */}
      {toast.visible && <Toast mensaje={toast.mensaje} duracion={4000} />}

      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Presentation />} />
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vuelos"
          element={
            <ProtectedRoute>
              <Vuelos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contacto"
          element={
            <ProtectedRoute>
              <Contacto />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cuenta"
          element={
            <ProtectedRoute>
              <Cuenta />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reservaciones"
          element={
            <ProtectedRoute>
              <Reservaciones />
            </ProtectedRoute>
          }
        />

        {/* ⭐ NUEVA RUTA PROTEGIDA DE NOTIFICACIONES */}
        <Route
          path="/notificaciones"
          element={
            <ProtectedRoute>
              <Notificaciones />
            </ProtectedRoute>
          }
        />

        {/* Solo admin */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />

        {/* Redirección de reservación */}
        <Route path="/reservacion/:id" element={<ReservacionRedirect />} />

        {/* 404 */}
        <Route path="*" element={<NotFoundFallback />} />
      </Routes>
    </>
  );
}

function ReservacionRedirect() {
  const { id } = useParams();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!id) {
      navigate("/vuelos", { replace: true });
      return;
    }
    navigate("/vuelos", { state: { openModalId: Number(id) } });
  }, [id, navigate]);

  return null;
}

function NotFoundFallback() {
  return (
    <div style={{ padding: 40 }}>
      <h2>Página no encontrada</h2>
      <p>
        La ruta que solicitaste no existe. Ve a <a href="/vuelos">Vuelos</a>.
      </p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppWrapper />
      </AuthProvider>
    </Router>
  );
}

export default App;
