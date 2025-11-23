// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // ⭐ Cargar usuario guardado por clave única
  useEffect(() => {
    const lastEmail = localStorage.getItem("lastLoggedEmail");

    if (lastEmail) {
      const savedUser = localStorage.getItem(`user_${lastEmail}`);
      if (savedUser) setUser(JSON.parse(savedUser));
    }
  }, []);

  // ⭐ Guardar usuario en su propia clave única
  useEffect(() => {
    if (user) {
      localStorage.setItem(`user_${user.correo}`, JSON.stringify(user));
      localStorage.setItem("lastLoggedEmail", user.correo);
    }
  }, [user]);

  // 🔥 Login: guardar datos del usuario
  const login = (userData) => {
    const formatted = {
      nombre: userData.nombre,
      correo: userData.correo,
      numero: userData.numero,
      direccion: userData.direccion,
      foto: userData.foto,
      rol: userData.rol,
      _id: userData._id,
    };

    setUser(formatted);

    // Guardar al usuario correcto inmediatamente
    localStorage.setItem(`user_${userData.correo}`, JSON.stringify(formatted));
    localStorage.setItem("lastLoggedEmail", userData.correo);
  };

  // Logout: solo borra la sesión activa
  const logout = () => {
    setUser(null);
    localStorage.removeItem("lastLoggedEmail");
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
