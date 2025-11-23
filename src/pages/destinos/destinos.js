// src/pages/destinos/destinos.js
import React, { useState, useEffect, useMemo } from "react";
import { vuelos } from "../../assets/mockups/vuelos";
import { useNavigate, useLocation } from "react-router-dom";
import "./destinos.css";
import { useAuth } from "../../context/AuthContext";

// Hook para leer query params
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

/** Helpers deterministas para duración, asientos, aeronave y precio **/
function hashStringToInt(str) {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function getEstimatedDuration(origen = "", destino = "") {
  const o = origen.toLowerCase();
  const d = destino.toLowerCase();

  const map = {
    cdmx_cancún: "2h 45m",
    cancún_guadalajara: "1h 50m",
    monterrey_cdmx: "1h 20m",
    "cdmx_nueva york": "5h 10m",
    cdmx_madrid: "10h 30m",
    "guadalajara_los ángeles": "4h 10m",
    cancún_parís: "11h 00m",
    tijuana_cdmx: "3h 10m",
  };

  const key = `${o}_${d}`;
  if (map[key]) return map[key];

  if (d.includes("madrid") || d.includes("parís") || d.includes("londres")) {
    return "9h 30m - 12h 00m";
  }
  if (
    d.includes("nueva york") ||
    d.includes("los ángeles") ||
    d.includes("miami")
  ) {
    return "4h 30m - 6h 30m";
  }

  const seed = (hashStringToInt(origen + destino) % 300) + 60;
  const hours = Math.floor(seed / 60);
  const mins = seed % 60;
  return `${hours}h ${mins.toString().padStart(2, "0")}m`;
}

function seatsAvailableFromId(id) {
  return (hashStringToInt(String(id)) % 48) + 2; // entre 2 y 49
}

function getAircraftTypeFromRoute(origen, destino) {
  const d = destino.toLowerCase();
  if (d.includes("madrid") || d.includes("parís")) {
    return "Boeing 787 / Airbus A330 (Largo alcance)";
  }
  if (d.includes("nueva york") || d.includes("los ángeles")) {
    return "Boeing 737 / Airbus A321 (Medio alcance)";
  }
  return "Airbus A320 / Boeing 737 (Corto-Medio alcance)";
}

function priceEstimate(origen, destino, pasajeros = 1) {
  const base = (hashStringToInt(origen + destino) % 8000) + 1200;
  const perPassenger = Math.round(base * 0.9);
  return {
    perPassenger,
    total: perPassenger * pasajeros,
  };
}

const Vuelos = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const query = useQuery();

  const origenFilter = query.get("origen")?.toLowerCase() || "";
  const destinoFilter = query.get("destino")?.toLowerCase() || "";
  const fechaFilter = query.get("fecha") || "";
  const pasajerosParam = query.get("pasajeros");
  const pasajerosFilter =
    pasajerosParam && !isNaN(parseInt(pasajerosParam, 10))
      ? parseInt(pasajerosParam, 10)
      : 0;

  const [vuelosFiltrados, setVuelosFiltrados] = useState(vuelos);
  const [showModal, setShowModal] = useState(false);
  const [selectedVuelo, setSelectedVuelo] = useState(null);
  const [wishlist, setWishlist] = useState(() => {
    if (!user?.correo) return [];
    try {
      return JSON.parse(
        localStorage.getItem(`wishlist_${user.correo}`) || "[]"
      );
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const filtrados = vuelos.filter((v) => {
      const matchOrigen = origenFilter
        ? v.origen.toLowerCase().includes(origenFilter)
        : true;
      const matchDestino = destinoFilter
        ? v.destino.toLowerCase().includes(destinoFilter)
        : true;
      const matchFecha = fechaFilter ? v.fecha_salida === fechaFilter : true;
      const matchPasajeros =
        pasajerosFilter > 0 ? v.pasajeros === pasajerosFilter : true;
      return matchOrigen && matchDestino && matchFecha && matchPasajeros;
    });
    setVuelosFiltrados(filtrados);
  }, [origenFilter, destinoFilter, fechaFilter, pasajerosFilter]);

  useEffect(() => {
    if (user?.correo) {
      localStorage.setItem(`wishlist_${user.correo}`, JSON.stringify(wishlist));
    }
  }, [wishlist, user?.correo]);

  const handleClearFilters = () => {
    setVuelosFiltrados(vuelos);
    navigate("/vuelos");
  };

  const openModal = (vuelo, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    // asegurar objeto completo
    const full = vuelos.find((v) => v.id === vuelo.id) || vuelo;
    setSelectedVuelo(full);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedVuelo(null);
    setShowModal(false);
  };

  const toggleWishlist = (vuelo, e) => {
    if (e?.stopPropagation) e.stopPropagation();

    if (!user?.correo) return; // evitar errores si no hay usuario

    const exists = wishlist.some((w) => w.id === vuelo.id);
    let next;

    if (exists) {
      next = wishlist.filter((w) => w.id !== vuelo.id);
    } else {
      next = [
        ...wishlist,
        {
          id: vuelo.id,
          nombre: vuelo.nombre,
          origen: vuelo.origen,
          destino: vuelo.destino,
          image: vuelo.image,
        },
      ];
    }

    localStorage.setItem(`wishlist_${user.correo}`, JSON.stringify(next));
    setWishlist(next);
  };

  const isInWishlist = (id) => wishlist.some((w) => w.id === id);

  const memoVuelos = useMemo(() => vuelosFiltrados, [vuelosFiltrados]);

  /* --- Abre modal si viene location.state.openModalId desde navigate(...) --- */
  useEffect(() => {
    const openId = location?.state?.openModalId;
    if (openId) {
      const idNum = Number(openId);
      const full = vuelos.find((v) => v.id === idNum);
      if (full) {
        // abrir modal con objeto completo
        setTimeout(() => {
          openModal(full);
          // limpiar state para que no se vuelva a abrir si el usuario recarga o retrocede
          try {
            navigate(location.pathname, { replace: true, state: {} });
          } catch (err) {
            // no crítico si falla
          }
        }, 80);
      } else {
        // si no lo encuentra, limpiar igualmente
        try {
          navigate(location.pathname, { replace: true, state: {} });
        } catch (err) {}
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  /* --- Mantengo la funcionalidad anterior de highlight por query param si quieres dejarla:
       (esto sigue funcionando si usas ?highlight=ID en vez de state) */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const highlightId = params.get("highlight");
    if (highlightId) {
      setTimeout(() => {
        const el = document.getElementById(`tarjeta-${highlightId}`);
        if (el) {
          el.classList.add("tarjeta-pop");
          try {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          } catch (err) {}
          setTimeout(() => el.classList.remove("tarjeta-pop"), 800);
        }
      }, 120);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  return (
    <div className="vuelos-container">
      <div className="header-with-button">
        <h1>Vuelos disponibles</h1>
        <button className="clear-btn" onClick={handleClearFilters}>
          Limpiar filtros
        </button>
      </div>

      {memoVuelos.length === 0 ? (
        <p>No se encontraron vuelos con esos datos.</p>
      ) : (
        <div className="tarjetas-grid">
          {memoVuelos.map((vuelo) => {
            const duration = getEstimatedDuration(vuelo.origen, vuelo.destino);
            const seats = seatsAvailableFromId(vuelo.id);
            const price = priceEstimate(
              vuelo.origen,
              vuelo.destino,
              vuelo.pasajeros || 1
            );

            return (
              <div
                id={`tarjeta-${vuelo.id}`}
                key={vuelo.id}
                className="tarjeta"
                onClick={() => navigate(`/reservacion/${vuelo.id}`)}
                role="article"
                aria-label={vuelo.nombre}
              >
                <button
                  className={`wish-btn ${
                    isInWishlist(vuelo.id) ? "wish-active" : ""
                  }`}
                  onClick={(e) => toggleWishlist(vuelo, e)}
                  aria-label={
                    isInWishlist(vuelo.id)
                      ? "Quitar de favoritos"
                      : "Agregar a favoritos"
                  }
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 21s-7-4.35-10-7.33C-1 8.64 3.5 3 7.5 5.5 9.08 6.6 10 8 12 9.5c2-1.5 2.92-2.9 4.5-4 4-2.5 8.5 3.14 5.5 8.17C19 16.65 12 21 12 21z" />
                  </svg>
                </button>

                <img src={vuelo.image} alt={vuelo.nombre} />
                <div className="contenido">
                  <h2 className="tarjeta-titulo">{vuelo.nombre}</h2>

                  <div className="info-rows">
                    <p>
                      <strong>Origen:</strong>{" "}
                      <span className="small">{vuelo.origen}</span>
                    </p>
                    <p>
                      <strong>Destino:</strong>{" "}
                      <span className="small">{vuelo.destino}</span>
                    </p>
                    <p>
                      <strong>Salida:</strong>{" "}
                      <span className="small">
                        {vuelo.fecha_salida}{" "}
                        {vuelo.hora_salida ? `• ${vuelo.hora_salida}` : ""}
                      </span>
                    </p>
                  </div>

                  <p className="descripcion">
                    {vuelo.descripcion && vuelo.descripcion !== "#"
                      ? vuelo.descripcion
                      : `${vuelo.origen} → ${vuelo.destino} • ${
                          vuelo.duracion || duration
                        }`}
                  </p>

                  <div className="tarjeta-meta">
                    <span>
                      <strong>Duración:</strong> {vuelo.duracion || duration}
                    </span>
                    <span>
                      <strong>Asientos:</strong> {seats} disponibles
                    </span>
                  </div>

                  <button
                    className="ver-mas-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(vuelo, e);
                    }}
                  >
                    Ver más
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && selectedVuelo && (
        <div
          className="modal-fondo"
          role="dialog"
          aria-modal="true"
          onClick={closeModal}
        >
          <div
            className="modal-contenedor vuelo-detalle"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="detalle-header">
              <img src={selectedVuelo.image} alt={selectedVuelo.nombre} />
              <div className="detalle-titulo">
                <h2>{selectedVuelo.nombre}</h2>
                <p className="detalle-route">
                  {selectedVuelo.origen} → {selectedVuelo.destino}
                </p>
                <p className="detalle-fecha">
                  <strong>Salida:</strong> {selectedVuelo.fecha_salida}{" "}
                  {selectedVuelo.hora_salida
                    ? `• ${selectedVuelo.hora_salida}`
                    : ""}
                </p>
              </div>
              <button
                className="modal-close"
                onClick={closeModal}
                aria-label="Cerrar detalle"
              >
                ✕
              </button>
            </div>

            <div className="detalle-body">
              <div className="detalle-left">
                {/* descripción (cliente) */}
                {selectedVuelo.descripcion &&
                selectedVuelo.descripcion !== "#" ? (
                  <p>{selectedVuelo.descripcion}</p>
                ) : (
                  <p>
                    {selectedVuelo.origen} → {selectedVuelo.destino}. Duración
                    aproximada: <strong>{selectedVuelo.duracion || "—"}</strong>
                    . Salida a las{" "}
                    <strong>{selectedVuelo.hora_salida || "—"}</strong> con{" "}
                    <strong>{selectedVuelo.aerolinea || "—"}</strong>.
                  </p>
                )}

                <p>
                  <strong>Aerolínea:</strong> {selectedVuelo.aerolinea || "—"}
                </p>
                <p>
                  <strong>Hora de salida:</strong>{" "}
                  {selectedVuelo.hora_salida || "—"}
                </p>
                <p>
                  <strong>Duración:</strong> {selectedVuelo.duracion || "—"}
                </p>
                <p>
                  <strong>Pasajeros (capacidad):</strong>{" "}
                  {selectedVuelo.pasajeros ?? "—"}
                </p>
                <p>
                  <strong>Disponibilidad estimada de asientos:</strong>{" "}
                  {seatsAvailableFromId(selectedVuelo.id)}
                </p>
              </div>

              <div className="detalle-right">
                <p className="precio">
                  <strong>Precio orientativo:</strong>
                </p>
                <p className="precio-valor">
                  {typeof selectedVuelo.precio === "number"
                    ? new Intl.NumberFormat("es-MX", {
                        style: "currency",
                        currency: "MXN",
                      }).format(selectedVuelo.precio)
                    : "Precio no disponible"}
                </p>

                <div className="modal-actions">
                  <button
                    className="boton-reservar"
                    onClick={() => {
                      closeModal();
                      // NUEVO: redirige a la pantalla de Reservaciones y abre el formulario con el vuelo seleccionado
                      navigate("/reservaciones", {
                        state: { openForm: true, vueloId: selectedVuelo.id },
                      });
                    }}
                  >
                    Reservar ahora
                  </button>

                  <button
                    className={`boton-wishlist ${
                      isInWishlist(selectedVuelo.id) ? "active" : ""
                    }`}
                    onClick={() => toggleWishlist(selectedVuelo)}
                    aria-pressed={isInWishlist(selectedVuelo.id)}
                  >
                    {isInWishlist(selectedVuelo.id)
                      ? "Quitar de favoritos"
                      : "Agregar a favoritos"}
                  </button>
                </div>

                <small className="nota">
                  Información orientativa. Horarios y disponibilidad sujetos a
                  confirmación por la aerolínea.
                </small>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vuelos;
