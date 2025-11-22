// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

/**
 * AuthProvider maneja la sesión del usuario y la guarda en localStorage.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Cargar usuario guardado al iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // Guardar usuario cuando cambie
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  // 🔥 Login: guardar datos del usuario
  const login = (userData) => {
    setUser({
      nombre: userData.nombre,
      correo: userData.correo,
      numero: userData.numero,       // ← NUEVO CAMPO
      direccion: userData.direccion, // ← NUEVO CAMPO
      foto: userData.foto,
      rol: userData.rol,
      _id: userData._id,
    });
  };

  // Logout
  const logout = () => setUser(null);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar AuthContext
export const useAuth = () => useContext(AuthContext);
