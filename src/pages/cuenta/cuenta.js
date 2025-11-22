// === CUENTA.JS ===
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./cuenta.css";
import { useAuth } from "../../context/AuthContext";

// Importar avatares
import avatar1 from "../../assets/avatars/avatar1.png";
import avatar2 from "../../assets/avatars/avatar2.png";
import avatar3 from "../../assets/avatars/avatar3.png";
import avatar4 from "../../assets/avatars/avatar4.png";

const Cuenta = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [mostrarAvatares, setMostrarAvatares] = useState(false);

  useEffect(() => {
    if (user?.correo) {
      const saved = JSON.parse(
        localStorage.getItem(`wishlist_${user.correo}`) || "[]"
      );
      setWishlist(saved);
    }
  }, [user?.correo]);

  // Avatar por usuario (ANTES del return condicional)
  const savedAvatar = localStorage.getItem(
    `avatarSeleccionado_${user?.correo || "temp"}`
  );

  const [avatarSeleccionado, setAvatarSeleccionado] = useState(
    savedAvatar || user?.foto || avatar1
  );

  // Guardar avatar sin modificar user
  useEffect(() => {
    if (user?.correo) {
      localStorage.setItem(
        `avatarSeleccionado_${user.correo}`,
        avatarSeleccionado
      );
    }
  }, [avatarSeleccionado, user?.correo]);

  // ❗ ESTE RETURN SIEMPRE VA DESPUÉS DE LOS HOOKS
  if (!user) return <p>Cargando usuario...</p>;

  const handleCerrarSesion = () => setMostrarConfirmacion(true);

  const confirmarCerrarSesion = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const cancelarCerrarSesion = () => setMostrarConfirmacion(false);

  const removeFromWishlist = (id) => {
    const current = JSON.parse(
      localStorage.getItem(`wishlist_${user.correo}`) || "[]"
    );
    const next = current.filter((w) => w.id !== id);

    localStorage.setItem(`wishlist_${user.correo}`, JSON.stringify(next));
    setWishlist(next);
  };

  return (
    <div className="cuenta-container">
      <div className="cuenta-izquierda">
        <div>
          <div className="foto-perfil-container">
            <img
              src={avatarSeleccionado}
              alt="Foto de perfil"
              className="foto-perfil"
              onClick={() => setMostrarAvatares((prev) => !prev)}
            />

            {mostrarAvatares && (
              <div className="avatar-popup">
                {[avatar1, avatar2, avatar3, avatar4].map((av, idx) => (
                  <img
                    key={idx}
                    src={av}
                    alt="avatar"
                    className={`avatar-item ${
                      avatarSeleccionado === av ? "avatar-activo" : ""
                    }`}
                    onClick={() => {
                      setAvatarSeleccionado(av);
                      setMostrarAvatares(false);
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <h1 className="cuenta-titulo">Mi Cuenta</h1>

          <div className="cuenta-info">
            <p>
              <strong>Nombre:</strong> {user.nombre}
            </p>
            <p>
              <strong>Correo:</strong> {user.correo}
            </p>
            <p>
              <strong>Teléfono:</strong> {user.numero}
            </p>
            <p>
              <strong>Dirección:</strong> {user.direccion}
            </p>
          </div>
        </div>

        <div className="lista-favoritos-texto">Lista de favoritos</div>

        <button
          className="toggle-deseados"
          onClick={() => setShowWishlist(true)}
        >
          Ver favoritos ({wishlist.length})
        </button>
        {showWishlist && (
          <div
            className="wishlist-modal-fondo"
            onClick={() => setShowWishlist(false)}
          >
            <div
              className="wishlist-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="wishlist-close"
                onClick={() => setShowWishlist(false)}
              >
                ✕
              </button>

              <h2>Mis favoritos</h2>

              {wishlist.length === 0 ? (
                <p className="wishlist-empty">No tienes favoritos guardados.</p>
              ) : (
                <div className="wishlist-grid">
                  {wishlist.map((w) => (
                    <div key={w.id} className="wishlist-card">
                      <img src={w.image} className="wishlist-thumb" />

                      <div className="wishlist-info">
                        <h4>{w.nombre}</h4>
                        <p>
                          {w.origen} → {w.destino}
                        </p>

                        <button
                          className="wishlist-vermas"
                          onClick={() => {
                            setShowWishlist(false);
                            navigate("/vuelos", {
                              state: { openModalId: w.id },
                            });
                          }}
                        >
                          Ver vuelo
                        </button>
                      </div>

                      <button
                        className="quitar-deseado"
                        onClick={() => removeFromWishlist(w.id)}
                      >
                        Quitar
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* BOTONES FINALES */}
              <div className="wishlist-bottom-buttons">
              </div>
            </div>
          </div>
        )}

        <button className="cerrar-sesion" onClick={handleCerrarSesion}>
          Cerrar sesión
        </button>
      </div>

      {/* Panel derecho */}
      <div className="cuenta-derecha">
        <div className="historial-header">
          <h2 className="historial-titulo">Historial de Vuelos</h2>
        </div>
      </div>

      {/* Modal de confirmación */}
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
    </div>
  );
};

export default Cuenta;
