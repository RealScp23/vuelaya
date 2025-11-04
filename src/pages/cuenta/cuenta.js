// === CUENTA.JS ===
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./cuenta.css";
import { vuelos } from "../../assets/mockups/vuelos";

const Cuenta = () => {
  const navigate = useNavigate();
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  const usuario = {
    nombre: "Antonio Pérez",
    correo: "antonio@example.com",
    telefono: "+52 123 456 7890",
    direccion: "Calle Principal 123, Ciudad de México",
    foto: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  };

  const historial = [
    { id: 1, descripcion: "Vuelo CDMX ✈ Cancún - Aeroméxico", fecha: "12/10/2025" },
    { id: 2, descripcion: "Vuelo Cancún ✈ Guadalajara - Volaris", fecha: "20/09/2025" },
    { id: 3, descripcion: "Vuelo Monterrey ✈ CDMX - VivaAerobus", fecha: "05/09/2025" },
    { id: 4, descripcion: "Vuelo CDMX ✈ Nueva York - American Airlines", fecha: "15/08/2025" },
    { id: 5, descripcion: "Vuelo Tijuana ✈ CDMX - Aeroméxico", fecha: "01/08/2025" },
    { id: 6, descripcion: "Vuelo CDMX ✈ Madrid - Iberia", fecha: "25/07/2025" },
    { id: 7, descripcion: "Vuelo Guadalajara ✈ Los Ángeles - Delta", fecha: "15/07/2025" },
    { id: 8, descripcion: "Vuelo Cancún ✈ París - Air France", fecha: "10/07/2025" },
  ];

  useEffect(() => {
    // carga la wishlist (ids y nombre) desde localStorage y mapea a vuelos reales si es posible
    try {
      const saved = JSON.parse(localStorage.getItem("wishlist") || "[]");
      // mapear a datos completos del vuelo (si existe en assets)
      const mapped = saved.map((w) => {
        const full = vuelos.find((v) => v.id === w.id);
        return full ? { ...full } : w;
      });
      setWishlist(mapped);
    } catch {
      setWishlist([]);
    }
  }, []);

  const handleCerrarSesion = () => {
    setMostrarConfirmacion(true);
  };

  const confirmarCerrarSesion = () => {
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  const cancelarCerrarSesion = () => {
    setMostrarConfirmacion(false);
  };

  const removeFromWishlist = (id) => {
    const current = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const next = current.filter((w) => w.id !== id);
    localStorage.setItem("wishlist", JSON.stringify(next));
    setWishlist((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="cuenta-container">
      {/* Panel izquierdo */}
      <div className="cuenta-izquierda">
        <div>
          <div className="foto-perfil-container">
            <img src={usuario.foto} alt="Foto de perfil" className="foto-perfil" />
          </div>

          <h1 className="cuenta-titulo">Mi Cuenta</h1>

          <div className="cuenta-info">
            <p><strong>Nombre:</strong> {usuario.nombre}</p>
            <p><strong>Correo:</strong> {usuario.correo}</p>
            <p><strong>Teléfono:</strong> {usuario.telefono}</p>
            <p><strong>Dirección:</strong> {usuario.direccion}</p>
          </div>
        </div>

        {/* Texto y botón de favoritos */}
        <div className="lista-favoritos-texto">Lista de favoritos</div>
        <button
          className="toggle-deseados"
          onClick={() => setShowWishlist(true)}
        >
          Ver favoritos ({wishlist.length})
        </button>

        {/* Botón de cerrar sesión */}
        <button className="cerrar-sesion" onClick={handleCerrarSesion}>
          Cerrar sesión
        </button>
      </div>

      {/* Panel derecho */}
      <div className="cuenta-derecha">
        <div className="historial-header">
          <h2 className="historial-titulo">Historial de Vuelos</h2>
        </div>

        <ul className="historial-lista">
          {historial.map((item) => (
            <li key={item.id} className="historial-item">
              <p>{item.descripcion}</p>
              <span>{item.fecha}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal de confirmación de cierre de sesión */}
      {mostrarConfirmacion && (
        <div className="modal-fondo">
          <div className="modal-contenedor">
            <h2>¿Deseas cerrar sesión?</h2>
            <div className="modal-botones">
              <button className="btn-cancelar" onClick={cancelarCerrarSesion}>
                Cancelar
              </button>
              <button className="btn-confirmar" onClick={confirmarCerrarSesion}>
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de wishlist */}
      {showWishlist && (
        <div className="wishlist-modal-fondo">
          <div className="wishlist-modal">
            <button
              className="wishlist-close"
              onClick={() => setShowWishlist(false)}
            >
              ×
            </button>
            <h2>Tus Favoritos</h2>
            {wishlist.length === 0 ? (
              <p className="wishlist-empty">No hay vuelos en tu lista de deseados.</p>
            ) : (
              <div className="wishlist-grid">
                {wishlist.map((w) => (
                  <li key={w.id} className="deseado-item">
                    <div className="deseado-left">
                      <img src={w.image} alt={w.nombre} className="deseado-thumb" />
                      <div>
                        <div className="deseado-title">{w.nombre}</div>
                        <div className="deseado-sub">{w.origen} → {w.destino}</div>
                      </div>
                    </div>
                    <div className="deseado-actions">
                      <button
                        className="ver-detalle"
                        onClick={() => {
                          // NUEVO: abrir modal del vuelo específico en la página de Vuelos
                          setShowWishlist(false);
                          // navegamos a /vuelos y pasamos state con el id a abrir
                          navigate("/vuelos", { state: { openModalId: w.id } });
                        }}
                      >
                        Ir a vuelo
                      </button>
                      <button onClick={() => removeFromWishlist(w.id)} className="quitar-deseado">
                        Quitar
                      </button>
                    </div>
                  </li>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cuenta;
