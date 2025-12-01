// src/components/ProtectedRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  // ⏳ Esperar que AuthContext cargue el usuario del localStorage
  if (loading) {
    return <div style={{ padding: "20px" }}>Cargando...</div>;
  }

  // 🔒 Si no hay usuario, redirige a login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✔ Si hay usuario, renderiza la página
  return children;
}

export default ProtectedRoute;