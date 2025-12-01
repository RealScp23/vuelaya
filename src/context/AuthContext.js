// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estado global del toast
  const [toast, setToast] = useState({ mensaje: "", visible: false });

  // Cargar usuario previamente guardado
  useEffect(() => {
    const lastEmail = localStorage.getItem("lastLoggedEmail");

    if (lastEmail) {
      const savedUser = localStorage.getItem(`user_${lastEmail}`);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }

    setTimeout(() => setLoading(false), 120);
  }, []);

  // Guardar usuario cuando cambie
  useEffect(() => {
    if (user && user.correo) {
      localStorage.setItem(`user_${user.correo}`, JSON.stringify(user));
      localStorage.setItem("lastLoggedEmail", user.correo);
    }
  }, [user]);

  // Login con toast
  const login = (userData) => {
    const formatted = {
      _id: userData.id || userData._id,  // siempre debe existir
      nombre: userData.nombre,
      correo: userData.correo,
      numero: userData.numero,
      direccion: userData.direccion,
      foto: userData.foto,
      rol: userData.rol,
    };

    setUser(formatted);
    localStorage.setItem(`user_${formatted.correo}`, JSON.stringify(formatted));
    localStorage.setItem("lastLoggedEmail", formatted.correo);

    // Mostrar toast global
    setToast({ mensaje: `¡Bienvenido, ${formatted.nombre}!`, visible: true });

    // Ocultar toast automáticamente después de 4 segundos
    setTimeout(() => {
      setToast({ mensaje: "", visible: false });
    }, 4000);
  };

  // Logout
  const logout = () => {
    if (user?.correo) {
      localStorage.removeItem(`user_${user.correo}`);
    }
    localStorage.removeItem("lastLoggedEmail");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        loading,
        toast, // exportamos el toast
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export { AuthContext };
