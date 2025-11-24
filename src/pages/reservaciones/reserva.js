// src/pages/reservaciones/reserva.js
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./reservaciones.css";
import { vuelos } from "../../assets/mockups/vuelos";

/* Helpers */
const formatCurrency = (n) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n || 0);

const API_URL = "http://localhost:5000/reservaciones";

/* Leer email del usuario desde localStorage (si está logueado) */
function getUsuarioEmail() {
  try {
    const raw = localStorage.getItem("usuario");
    if (!raw) return "";
    const u = JSON.parse(raw);
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

  const getVueloById = (id) => vuelos.find((v) => Number(v.id) === Number(id));
  const computePrecio = (vuelo, pasajeros = 1) =>
    vuelo && typeof vuelo.precio === "number" ? vuelo.precio * Math.max(1, pasajeros) : 1000 * Math.max(1, pasajeros);

  // 🔹 Obtener todas las reservaciones desde el backend
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then(setReservas)
      .catch((err) => console.error("Error al obtener reservaciones:", err));
  }, []);

  // Si venimos desde otra pantalla con { openForm, vueloId }
  useEffect(() => {
    const st = location.state || {};
    if (!handledOpenFromState.current && st.openForm && st.vueloId) {
      handledOpenFromState.current = true;
      const vuelo = getVueloById(st.vueloId);
      const precio = computePrecio(vuelo, 1);

      setForm({
        vueloId: vuelo?.id || st.vueloId,
        nombrePasajero: "",
        telefono: "",
        pasajeros: 1,
        asiento: "",
        precio_total: precio,
        aerolinea: vuelo?.aerolinea || "",
        fecha_salida: vuelo?.fecha_salida || "",
        hora_salida: vuelo?.hora_salida || "",
        descripcion: vuelo?.descripcion || "",
        cardName: "",
        cardNumber: "",
        expiry: "",
        cvc: ""
      });
      setFormMode("create");
      setFormOpen(true);
      window.history.replaceState({}, "");
    }
  }, [location.state]);

  // 🔹 Crear nueva reserva (POST)
const crearReserva = async (payload) => {
  setProcessingPayment(true);
  await new Promise((r) => setTimeout(r, 800));
  setProcessingPayment(false);

  const userEmail = getUsuarioEmail();

  const reserva = {
    vueloId: payload.vueloId,
  nombre: payload.nombre || payload.nombrePasajero || "Sin nombre", // ✅ usa el campo correcto
    email: userEmail || "",
    telefono: payload.telefono,
    pasajeros: Number(payload.pasajeros),
    asiento: payload.asiento || "Asignar",
    precio_total: Number(payload.precio_total) || 0,
    aerolinea: payload.aerolinea || "",
    fecha_salida: payload.fecha_salida || "",
    hora_salida: payload.hora_salida || "",
    descripcion: payload.descripcion || "",
    payment: {
      status: "paid",
      cardLast4: payload.cardNumber
        ? payload.cardNumber.replace(/\D/g, "").slice(-4)
        : "0000",
      method: payload.cardName || "Tarjeta",
    },
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reserva),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("❌ Error del backend:", errorData);
      throw new Error(errorData.error || "Error al crear la reservación");
    }

    const nueva = await res.json();
    console.log("✅ Reserva guardada correctamente:", nueva);

    setReservas((prev) => [nueva, ...prev]);
    setFormOpen(false);
    setSuccessMessage("Reserva creada correctamente.");
    setTimeout(() => setSuccessMessage(null), 2500);
  } catch (error) {
    console.error("❌ Error al crear reserva:", error);
    alert("Error al crear la reservación: " + error.message);
  }
};


  // 🔹 Actualizar reserva (PUT)
  const actualizarReserva = async (id, data) => {
    try {
      const body = {
        nombre: data.nombrePasajero,
        telefono: data.telefono,
        pasajeros: data.pasajeros,
        asiento: data.asiento,
        precio_total: data.precio_total,
        descripcion: data.descripcion,
        payment: {
          method: data.cardName,
          cardLast4: data.cardNumber ? data.cardNumber.replace(/\D/g, "").slice(-4) : undefined
        }
      };
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const updated = await res.json();
      setReservas((prev) => prev.map((r) => (r._id === id ? updated : r)));
      setFormOpen(false);
      setSuccessMessage("Reserva actualizada correctamente.");
      setTimeout(() => setSuccessMessage(null), 2500);
    } catch (error) {
      console.error("Error al actualizar reserva:", error);
      alert("No se pudo actualizar la reservación.");
    }
  };

  // 🔹 Eliminar reserva (DELETE)
  const cancelarReserva = async (id) => {
    if (!window.confirm("¿Confirmas cancelar esta reservación?")) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setReservas((prev) => prev.filter((r) => r._id !== id));
      setSelected(null);
    } catch (error) {
      console.error("Error al eliminar reserva:", error);
      alert("No se pudo eliminar la reservación.");
    }
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
      descripcion: v?.descripcion || "",
      cardName: "",
      cardNumber: "",
      expiry: "",
      cvc: ""
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
      descripcion: r.descripcion || "",
      cardName: r.payment?.method || "",
      cardNumber: "",
      expiry: "",
      cvc: ""
    });
    setFormMode("edit");
    setFormOpen(true);
    setSelected(r);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form };

    // Validaciones
    if (!payload.nombrePasajero.trim()) return alert("El nombre del pasajero es obligatorio");
    if (!payload.telefono.trim()) return alert("El teléfono es obligatorio");
    if (!payload.cardName) return alert("Selecciona el tipo de tarjeta");
    if (!payload.cardNumber.match(/^\d{13,19}$/)) return alert("Número de tarjeta inválido");
    if (!payload.expiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) return alert("Fecha de expiración inválida");
    if (!payload.cvc.match(/^\d{3,4}$/)) return alert("CVC inválido");

    if (formMode === "create") crearReserva(payload);
    else if (formMode === "edit" && selected) actualizarReserva(selected._id, payload);
  };

  return (
    <div className="reservaciones-page">
      <header className="reservaciones-header">
        <div className="left">
          <h1>Mis Reservaciones</h1>
          <p className="subtitulo">
            Gestiona tus viajes — pago simulado, CRUD cliente.
          </p>
        </div>
        <div className="actions-header">
          <button className="btn-prim" onClick={() => openFormForVuelo(null)}>
            Nueva reservación
          </button>
        </div>
      </header>

      <main className="reservas-grid-wrap">
        <section className="panel-reservas">
          <div className="panel-titulo">
            <h2>
              Tus reservaciones <span className="badge">{reservas.length}</span>
            </h2>
          </div>

          {reservas.length === 0 ? (
            <div className="reservas-empty">No hay reservaciones aún.</div>
          ) : (
            <ul className="reservas-grid">
              {reservas.map((r) => {
                const vuelo = getVueloById(r.vueloId) || {};
                return (
                  <li key={r._id} className="reserva-card">
                    <div className="reserva-left">
                      <div className="reserva-titulo">
                        {r.nombre || vuelo.nombre || "Reserva"}
                      </div>
                      <div className="reserva-route">
                        {vuelo.origen || "—"} → {vuelo.destino || "—"}
                      </div>
                      <div className="reserva-fecha">
                        {r.fecha_salida || vuelo.fecha_salida} •{" "}
                        {r.hora_salida || vuelo.hora_salida}
                      </div>
                      <div className="reserva-meta">
                        Pasajeros: {r.pasajeros} • Asiento: {r.asiento}
                      </div>
                    </div>

                    <div className="reserva-right">
                      <div className="reserva-precio">
                        {formatCurrency(r.precio_total)}
                      </div>
                      <div className="reserva-actions">
                        <button
                          className="btn-sec"
                          onClick={() => setSelected(r)}
                        >
                          Ver
                        </button>
                        <button
                          className="btn-prim"
                          onClick={() =>
                            navigate("/vuelos", {
                              state: { openModalId: r.vueloId },
                            })
                          }
                        >
                          Ir a vuelo
                        </button>
                        <button
                          className="btn-danger"
                          onClick={() => cancelarReserva(r._id)}
                        >
                          Cancelar
                        </button>
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
            {reservas.length === 0 ? (
              <div className="muted">Sin actividad reciente</div>
            ) : (
              <ul className="mini-list">
                {reservas.slice(0, 5).map((r) => (
                  <li key={r._id}>
                    <strong>{r.nombre}</strong>
                    <div className="muted small">
                      {r.fecha_salida} • {formatCurrency(r.precio_total)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="resumen-card">
            <h3>Ayuda rápida</h3>
            <p className="muted small">
              Pago simulado. No guardamos tarjeta ni CVC.
            </p>
          </div>
        </aside>
      </main>

      {/* Detalle Modal */}
      {selected && (
        <div
          className="modal-fondo reserva-modal-fondo"
          onClick={() => setSelected(null)}
        >
          <div
            className="modal-contenedor reserva-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setSelected(null)}>
              ✕
            </button>
            <h2>{selected.nombre}</h2>
            <p className="modal-sub">
              {getVueloById(selected.vueloId)?.origen} →{" "}
              {getVueloById(selected.vueloId)?.destino} •{" "}
              {selected.fecha_salida}
            </p>

            <div className="modal-content-scroll">
              <div className="resumen-grid">
                <div>
                  <strong>Aerolínea:</strong>
                  <div>{selected.aerolinea || "—"}</div>
                </div>
                <div>
                  <strong>Pasajeros:</strong>
                  <div>{selected.pasajeros}</div>
                </div>
                <div>
                  <strong>Asiento:</strong>
                  <div>{selected.asiento || "—"}</div>
                </div>
                <div>
                  <strong>Pago:</strong>
                  <div>
                    {selected.payment?.method} ****{selected.payment?.cardLast4}
                  </div>
                </div>
              </div>
              <p className="descripcion-modal">
                {selected.descripcion || "No hay descripción adicional."}
              </p>
            </div>

            <div className="modal-actions">
              <button
                className="btn-sec"
                onClick={() => openEditForm(selected)}
              >
                Editar
              </button>
              <button
                className="btn-danger"
                onClick={() => cancelarReserva(selected.id)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form modal */}
      {formOpen && (
        <div
          className="modal-fondo reserva-modal-fondo"
          onClick={() => setFormOpen(false)}
        >
          <div
            className="modal-contenedor reserva-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setFormOpen(false)}>
              ✕
            </button>
            <h2>
              {formMode === "create"
                ? "Nueva reservación"
                : "Editar reservación"}
            </h2>

            <div className="modal-content-scroll">
              <form className="form-reserva" onSubmit={onSubmit}>
                <div className="form-row">
                  <label>Vuelo</label>
                  <input
                    readOnly
                    value={
                      getVueloById(form.vueloId)?.nombre ||
                      "Selecciona desde Vuelos"
                    }
                  />
                </div>

                <div className="form-row">
                  <label>Nombre del pasajero</label>
                  <input
                    required
                    value={form.nombrePasajero}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, nombrePasajero: e.target.value }))
                    }
                  />
                </div>

                <div className="form-row two">
                  <div>
                    <label>Teléfono</label>
                    <input
                      value={form.telefono}
                      onChange={(e) =>
                        setForm((s) => ({ ...s, telefono: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label>Pasajeros</label>
                    <input
                      type="number"
                      min="1"
                      value={form.pasajeros}
                      onChange={(e) => {
                        const p = Math.max(1, Number(e.target.value || 1));
                        const v = getVueloById(form.vueloId);
                        setForm((s) => ({
                          ...s,
                          pasajeros: p,
                          precio_total: computePrecio(v, p),
                        }));
                      }}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <label>Asiento (opcional)</label>
                  <input
                    value={form.asiento}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, asiento: e.target.value }))
                    }
                  />
                </div>

                <hr />
                <h4>Pago (simulado)</h4>

                <div className="form-row">
                  <label>Tipo de tarjeta</label>
                  <select
                    required
                    value={form.cardName}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, cardName: e.target.value }))
                    }
                  >
                    <option value="">Selecciona una tarjeta</option>
                    <option value="Visa">Visa</option>
                    <option value="MasterCard">MasterCard</option>
                    <option value="American Express">American Express</option>
                    <option value="Carnet">Carnet</option>
                    <option value="Banamex">Banamex</option>
                    <option value="BBVA">BBVA</option>
                    <option value="HSBC">HSBC</option>
                  </select>
                </div>

                <div className="form-row two">
                  <div>
                    <label>Número de tarjeta</label>
                    <input
                      placeholder="1234123412341234"
                      value={form.cardNumber}
                      onChange={(e) =>
                        setForm((s) => ({
                          ...s,
                          cardNumber: e.target.value.replace(/\D/g, ""),
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label>Expira (MM/AA)</label>
                    <input
                      placeholder="08/26"
                      value={form.expiry}
                      onChange={(e) =>
                        setForm((s) => ({ ...s, expiry: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="form-row two">
                  <div>
                    <label>CVC</label>
                    <input
                      placeholder="123"
                      value={form.cvc}
                      onChange={(e) =>
                        setForm((s) => ({
                          ...s,
                          cvc: e.target.value.replace(/\D/g, ""),
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label>Precio total</label>
                    <input readOnly value={formatCurrency(form.precio_total)} />
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    type="submit"
                    className="btn-prim"
                    disabled={processingPayment}
                  >
                    {processingPayment
                      ? "Procesando..."
                      : formMode === "create"
                      ? "Pagar y reservar"
                      : "Guardar cambios"}
                  </button>
                  <button
                    type="button"
                    className="btn-sec"
                    onClick={() => setFormOpen(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </form>

              {successMessage && (
                <div className="success-banner">{successMessage}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}