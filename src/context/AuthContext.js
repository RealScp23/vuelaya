// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);  // ← NUEVO

  // ⭐ Cargar usuario guardado al iniciar
  useEffect(() => {
    const lastEmail = localStorage.getItem("lastLoggedEmail");

    if (lastEmail) {
      const savedUser = localStorage.getItem(`user_${lastEmail}`);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }

    // simular carga mínima para evitar parpadeo
    setTimeout(() => {
      setLoading(false);
    }, 100);
  }, []);

  // ⭐ Guardar usuario cada vez que cambia
  useEffect(() => {
    if (user) {
      localStorage.setItem(`user_${user.correo}`, JSON.stringify(user));
      localStorage.setItem("lastLoggedEmail", user.correo);
    }
  }, [user]);

  // 🔥 Login
  const login = (userData) => {
    const formatted = {
      nombre: userData.nombre,
      correo: userData.correo,
      numero: userData.numero,
      direccion: userData.direccion,
      foto: userData.foto,
      rol: userData.rol,
      _id: userData.id || userData._id, // ✔️ Soporta ambos
    };

    setUser(formatted);

    localStorage.setItem(`user_${userData.correo}`, JSON.stringify(formatted));
    localStorage.setItem("lastLoggedEmail", userData.correo);
  };

  // 🔥 Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("lastLoggedEmail");
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export { AuthContext };
