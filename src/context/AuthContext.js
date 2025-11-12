// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

/**
 * AuthProvider envuelve toda la app y gestiona la sesión del usuario.
 * Guarda el usuario en localStorage y ofrece funciones login/logout.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Cargar usuario guardado al iniciar la app
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // Guardar o eliminar usuario cuando cambie
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  // Funciones de autenticación
  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);
