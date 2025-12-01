import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import "./Notificaciones.css";

export default function Notificaciones() {
  const { user } = useAuth();
  const [notificaciones, setNotificaciones] = useState([]);

  const cargarNotificaciones = useCallback(async () => {
    if (!user?._id) return;
    try {
      const res = await axios.get(`http://localhost:5000/notificaciones/${user._id}`);
      setNotificaciones(res.data);
    } catch (error) {
      console.error("Error al cargar notificaciones:", error);
    }
  }, [user?._id]);

  useEffect(() => {
    cargarNotificaciones();
  }, [cargarNotificaciones]);

  // Marcar como leída
  const marcarComoLeida = async (id) => {
    try {
      await axios.put(`http://localhost:5000/notificaciones/${id}/leida`);
      setNotificaciones((prev) => 
        prev.map((n) => (n._id === id ? { ...n, leida: true } : n))
      );
    } catch (error) {
      console.error("Error al marcar como leída:", error);
    }
  };

  // Borrar notificación
  const borrarNotificacion = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/notificaciones/${id}`);
      setNotificaciones((prev) => prev.filter((n) => n._id !== id));
    } catch (error) {
      console.error("Error al eliminar notificación:", error);
    }
  };

  return (
    <div className="notif-container">
      <h2 className="notif-title">Notificaciones</h2>

      {notificaciones.length === 0 ? (
        <p className="notif-empty">No tienes notificaciones.</p>
      ) : (
        <ul className="notif-list">
          {notificaciones.map((n) => (
            <li key={n._id} className={`notif-item ${n.leida ? "leida" : "no-leida"}`}>
              <div className="notif-msg">{n.mensaje}</div>
              <div className="notif-date">{new Date(n.createdAt).toLocaleString()}</div>
              <div className="notif-actions">
                {!n.leida && (
                  <button onClick={() => marcarComoLeida(n._id)} className="btn-leer">
                    Marcar como leída
                  </button>
                )}
                <button onClick={() => borrarNotificacion(n._id)} className="btn-borrar">
                  Borrar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
