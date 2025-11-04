// src/pages/reservaciones/reserva.js
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./reservaciones.css";
import { vuelos } from "../../assets/mockups/vuelos";

/* Helpers */
const formatCurrency = (n) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n || 0);

const LOCAL_KEY = "reservaciones_app_v1";

/* Intenta leer el email del usuario desde localStorage (si existe el objeto "usuario") */
function getUsuarioEmail() {
  try {
    const raw = localStorage.getItem("usuario");
    if (!raw) return "";
    const u = JSON.parse(raw);
    // soporta keys "correo" o "email"
    return u?.correo || u?.email || "";
  } catch {
    return "";
  }
}

export default function Reservaciones() {
  const navigate = useNavigate();
  const location = useLocation();
  const handledOpenFromState = useRef(false);

  const [reservas, setReservas] = useState([]);
  const [selected, setSelected] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [form, setForm] = useState({
    vueloId: null,
    nombrePasajero: "",
    telefono: "",
    pasajeros: 1,
    asiento: "",
    precio_total: 0,
    aerolinea: "",
    fecha_salida: "",
    hora_salida: "",
    descripcion: "",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvc: ""
  });
  const [processingPayment, setProcessingPayment] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
      if (Array.isArray(raw)) setReservas(raw);
      else setReservas([]);
    } catch (err) {
      console.error("Error leyendo reservaciones:", err);
      setReservas([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(reservas));
    } catch (err) {
      console.error("Error guardando reservaciones:", err);
    }
  }, [reservas]);

  const getVueloById = (id) => vuelos.find((v) => Number(v.id) === Number(id));

  const computePrecio = (vuelo, pasajeros = 1) => {
    if (!vuelo) return 0;
    if (typeof vuelo.precio === "number") return vuelo.precio * Math.max(1, pasajeros);
    return 1000 * Math.max(1, pasajeros);
  };

  // Si venimos desde otra pantalla con state { openForm: true, vueloId }, abrimos el formulario una sola vez
  useEffect(() => {
    try {
      const st = location.state || {};
      if (!handledOpenFromState.current && st.openForm && st.vueloId) {
        handledOpenFromState.current = true;
        const vuelo = getVueloById(st.vueloId);
        const precio = computePrecio(vuelo, 1);
        setForm({
          ...form,
          vueloId: vuelo?.id || st.vueloId,
          nombrePasajero: "",
          telefono: "",
          pasajeros: 1,
          asiento: "",
          precio_total: precio,
          aerolinea: vuelo?.aerolinea || "",
          fecha_salida: vuelo?.fecha_salida || "",
          hora_salida: vuelo?.hora_salida || "",
          descripcion: vuelo?.descripcion || ""
        });
        setFormMode("create");
        setFormOpen(true);

        // Limpiar state del history de forma segura (no provoca re-render del router)
        try {
          if (window && window.history && window.history.replaceState) {
            const newState = { ...(window.history.state || {}) };
            if (newState && newState.state) {
              delete newState.state.openForm;
              delete newState.state.vueloId;
            }
            window.history.replaceState(newState, "");
          }
        } catch (err) {
          // no crítico
        }
      }
    } catch (err) {
      console.error("Error procesando location.state en Reservaciones:", err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  // CRUD básico
  const crearReserva = async (payload) => {
    setProcessingPayment(true);
    await new Promise((r) => setTimeout(r, 900));
    setProcessingPayment(false);

    const userEmail = getUsuarioEmail();

    const id = Date.now();
    const reserva = {
      id,
      vueloId: payload.vueloId,
      nombre: payload.nombrePasajero,
      email: userEmail || "", // ahora el email viene del usuario logueado (si existe)
      telefono: payload.telefono,
      pasajeros: Number(payload.pasajeros),
      asiento: payload.asiento || "Asignar",
      precio_total: Number(payload.precio_total) || 0,
      aerolinea: payload.aerolinea || "",
      fecha_salida: payload.fecha_salida || "",
      hora_salida: payload.hora_salida || "",
      descripcion: payload.descripcion || "",
      createdAt: new Date().toISOString(),
      payment: {
        status: "paid",
        cardLast4: payload.cardNumber ? payload.cardNumber.replace(/\D/g, "").slice(-4) : "0000",
        method: "Tarjeta (simulada)"
      }
    };
    setReservas((p) => [reserva, ...p]);
    setFormOpen(false);
    setSuccessMessage("Reserva creada (simulado).");
    setTimeout(() => setSuccessMessage(null), 2500);
  };

  const actualizarReserva = (id, data) => {
    setReservas((p) => p.map((r) => (r.id === id ? { ...r, ...data } : r)));
    setFormOpen(false);
    setSuccessMessage("Reserva actualizada.");
    setTimeout(() => setSuccessMessage(null), 2000);
  };

  const cancelarReserva = (id) => {
    if (!window.confirm("¿Confirmas cancelar esta reservación?")) return;
    setReservas((p) => p.filter((r) => r.id !== id));
    setSelected(null);
  };

  const openFormForVuelo = (vueloId) => {
    const v = getVueloById(vueloId);
    const precio = computePrecio(v, 1);
    setForm({
      vueloId: v?.id || vueloId,
      nombrePasajero: "",
      telefono: "",
      pasajeros: 1,
      asiento: "",
      precio_total: precio,
      aerolinea: v?.aerolinea || "",
      fecha_salida: v?.fecha_salida || "",
      hora_salida: v?.hora_salida || "",
      descripcion: v?.descripcion || ""
    });
    setFormMode("create");
    setFormOpen(true);
  };

  const openEditForm = (r) => {
    setForm({
      vueloId: r.vueloId,
      nombrePasajero: r.nombre,
      telefono: r.telefono,
      pasajeros: r.pasajeros,
      asiento: r.asiento,
      precio_total: r.precio_total,
      aerolinea: r.aerolinea,
      fecha_salida: r.fecha_salida,
      hora_salida: r.hora_salida,
      descripcion: r.descripcion || ""
    });
    setFormMode("edit");
    setFormOpen(true);
    setSelected(r);
  };

  // Submit del form
  const onSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (formMode === "create") crearReserva(payload);
    else if (formMode === "edit" && selected) actualizarReserva(selected.id, payload);
  };

  return (
    <div className="reservaciones-page">
      <header className="reservaciones-header">
        <div className="left">
          <h1>Mis Reservaciones</h1>
          <p className="subtitulo">Gestiona tus viajes — pago simulado, demo cliente.</p>
        </div>
        <div className="actions-header">
          <button
            className="btn-prim"
            onClick={() => {
              setForm({
                vueloId: null,
                nombrePasajero: "",
                telefono: "",
                pasajeros: 1,
                asiento: "",
                precio_total: 0,
                aerolinea: "",
                fecha_salida: "",
                hora_salida: "",
                descripcion: ""
              });
              setFormMode("create");
              setFormOpen(true);
            }}
          >
            Nueva reservación
          </button>
        </div>
      </header>

      <main className="reservas-grid-wrap">
        <section className="panel-reservas">
          <div className="panel-titulo">
            <h2>Tus reservaciones <span className="badge">{reservas.length}</span></h2>
          </div>

          {reservas.length === 0 ? (
            <div className="reservas-empty">No hay reservaciones. Reserva un vuelo desde la pantalla de Vuelos.</div>
          ) : (
            <ul className="reservas-grid">
              {reservas.map((r) => {
                const vuelo = getVueloById(r.vueloId) || {};
                return (
                  <li key={r.id} className="reserva-card">
                    <div className="reserva-left">
                      <div className="reserva-titulo">{r.nombre || vuelo.nombre || "Reserva"}</div>
                      <div className="reserva-route">{vuelo.origen || r.origen || "—"} → {vuelo.destino || r.destino || "—"}</div>
                      <div className="reserva-fecha">{r.fecha_salida || vuelo.fecha_salida} • {r.hora_salida || vuelo.hora_salida}</div>
                      <div className="reserva-meta">Pasajeros: {r.pasajeros} • Asiento: {r.asiento}</div>
                    </div>

                    <div className="reserva-right">
                      <div className="reserva-precio">{formatCurrency(r.precio_total)}</div>
                      <div className="reserva-actions">
                        <button className="btn-sec" onClick={() => setSelected(r)}>Ver</button>
                        <button
                          className="btn-prim"
                          onClick={() => {
                            if (r.vueloId) navigate("/vuelos", { state: { openModalId: r.vueloId } });
                            else navigate(`/reservacion/${r.id}`);
                          }}
                        >
                          Ir a vuelo
                        </button>
                        <button className="btn-danger" onClick={() => cancelarReserva(r.id)}>Cancelar</button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <aside className="panel-resumen">
          <div className="resumen-card">
            <h3>Reservas recientes</h3>
            {reservas.length === 0 ? <div className="muted">Sin actividad reciente</div> : (
              <ul className="mini-list">
                {reservas.slice(0,5).map((r) => (
                  <li key={r.id}>
                    <strong>{r.nombre || getVueloById(r.vueloId)?.nombre}</strong>
                    <div className="muted small">{r.fecha_salida} • {formatCurrency(r.precio_total)}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="resumen-card">
            <h3>Ayuda rápida</h3>
            <p className="muted small">Pago simulado. No guardamos tarjeta completa ni CVC.</p>
          </div>
        </aside>
      </main>

      {/* Detalle modal */}
      {selected && (
        <div className="modal-fondo reserva-modal-fondo" onClick={() => setSelected(null)}>
          <div className="modal-contenedor reserva-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
            <h2>{selected.nombre}</h2>
            <p className="modal-sub">{getVueloById(selected.vueloId)?.origen || ""} → {getVueloById(selected.vueloId)?.destino || ""} • {selected.fecha_salida}</p>

            {/* contenido scrolleable */}
            <div className="modal-content-scroll">
              <div className="resumen-grid">
                <div>
                  <strong>Aerolínea:</strong>
                  <div>{selected.aerolinea || getVueloById(selected.vueloId)?.aerolinea || "—"}</div>
                </div>
                <div>
                  <strong>Duración:</strong>
                  <div>{selected.duracion || getVueloById(selected.vueloId)?.duracion || "—"}</div>
                </div>
                <div>
                  <strong>Pasajeros:</strong>
                  <div>{selected.pasajeros}</div>
                </div>
                <div>
                  <strong>Asiento:</strong>
                  <div>{selected.asiento || "—"}</div>
                </div>
              </div>

              <p className="descripcion-modal">{selected.descripcion || "No hay descripción adicional."}</p>
            </div>

            {/* acciones visibles fuera del scroll */}
            <div className="modal-actions">
              <button className="btn-prim" onClick={() => { setSelected(null); openFormForVuelo(selected.vueloId); }}>Reservar ahora</button>
              <button className="btn-sec" onClick={() => openEditForm(selected)}>Editar</button>
              <button className="btn-danger" onClick={() => cancelarReserva(selected.id)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Form modal */}
      {formOpen && (
        <div className="modal-fondo reserva-modal-fondo" onClick={() => setFormOpen(false)}>
          <div className="modal-contenedor reserva-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setFormOpen(false)}>✕</button>
            <h2>{formMode === "create" ? "Nueva reservación" : "Editar reservación"}</h2>

            {/* contenido scrolleable (formulario) */}
            <div className="modal-content-scroll">
              <form className="form-reserva" onSubmit={onSubmit}>
                <div className="form-row">
                  <label>Vuelo</label>
                  <input readOnly value={getVueloById(form.vueloId)?.nombre || "Selecciona desde Vuelos"} />
                </div>

                <div className="form-row">
                  <label>Nombre del pasajero</label>
                  <input required value={form.nombrePasajero} onChange={(e) => setForm((s) => ({ ...s, nombrePasajero: e.target.value }))} />
                </div>

                <div className="form-row two">
                  <div>
                    <label>Teléfono</label>
                    <input value={form.telefono} onChange={(e) => setForm((s) => ({ ...s, telefono: e.target.value }))} />
                  </div>
                  <div>
                    <label>Pasajeros</label>
                    <input type="number" min="1" value={form.pasajeros} onChange={(e) => {
                      const p = Math.max(1, Number(e.target.value || 1));
                      const v = getVueloById(form.vueloId);
                      setForm((s) => ({ ...s, pasajeros: p, precio_total: computePrecio(v, p) }));
                    }} />
                  </div>
                </div>

                <div className="form-row">
                  <label>Asiento (opcional)</label>
                  <input value={form.asiento} onChange={(e) => setForm((s) => ({ ...s, asiento: e.target.value }))} />
                </div>

                <hr />

                <h4>Pago (simulado)</h4>

                <div className="form-row">
                  <label>Nombre en la tarjeta</label>
                  <input value={form.cardName} onChange={(e) => setForm((s) => ({ ...s, cardName: e.target.value }))} />
                </div>

                <div className="form-row two">
                  <div>
                    <label>Número de tarjeta</label>
                    <input placeholder="1234 1234 1234 1234" value={form.cardNumber} onChange={(e) => setForm((s) => ({ ...s, cardNumber: e.target.value }))} />
                  </div>
                  <div>
                    <label>Expira (MM/AA)</label>
                    <input placeholder="08/26" value={form.expiry} onChange={(e) => setForm((s) => ({ ...s, expiry: e.target.value }))} />
                  </div>
                </div>

                <div className="form-row two">
                  <div>
                    <label>CVC</label>
                    <input placeholder="123" value={form.cvc} onChange={(e) => setForm((s) => ({ ...s, cvc: e.target.value }))} />
                  </div>

                  <div>
                    <label>Precio total</label>
                    <input readOnly value={formatCurrency(form.precio_total)} />
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="submit" className="btn-prim" disabled={processingPayment}>
                    {processingPayment ? "Procesando..." : (formMode === "create" ? "Pagar y reservar" : "Guardar")}
                  </button>
                  <button type="button" className="btn-sec" onClick={() => setFormOpen(false)}>Cancelar</button>
                </div>
              </form>

              {successMessage && <div className="success-banner">{successMessage}</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
