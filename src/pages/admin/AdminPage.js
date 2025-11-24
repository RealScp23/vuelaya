import React, { useEffect, useState } from "react";
import "./admin.css";

function AdminPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [destinos, setDestinos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [nuevoDestino, setNuevoDestino] = useState({
    nombre: "",
    descripcion: "",
    origen: "",
    destino: "",
    fecha_salida: "",
    pasajeros: "",
    hora_salida: "",
    aerolinea: "",
    precio: "",
    duracion: "",
    image: "",
  });

  useEffect(() => {
    obtenerUsuarios();
    obtenerDestinos();
  }, []);

  const obtenerUsuarios = async () => {
    try {
      const res = await fetch("http://localhost:5000/usuarios");
      const data = await res.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  const cambiarRol = async (id, nuevoRol) => {
    try {
      await fetch(`http://localhost:5000/usuarios/${id}/rol`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rol: nuevoRol }),
      });

      setUsuarios((prev) =>
        prev.map((u) => (u._id === id ? { ...u, rol: nuevoRol } : u))
      );
    } catch (error) {
      console.log("Error al actualizar rol:", error);
    }
  };

  const eliminarUsuario = async (id) => {
    try {
      await fetch(`http://localhost:5000/usuarios/${id}`, { method: "DELETE" });
      setUsuarios((prev) => prev.filter((u) => u._id !== id));
    } catch (error) {
      console.log("Error al eliminar usuario:", error);
    }
  };

  const obtenerDestinos = async () => {
    try {
      const res = await fetch("http://localhost:5000/destinos");
      const data = await res.json();
      setDestinos(data);
    } catch (error) {
      console.error("Error al cargar destinos:", error);
    }
  };

  const crearDestino = async () => {
    try {
      await fetch("http://localhost:5000/destinos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoDestino),
      });

      setNuevoDestino({
        nombre: "",
        descripcion: "",
        origen: "",
        destino: "",
        fecha_salida: "",
        pasajeros: "",
        hora_salida: "",
        aerolinea: "",
        precio: "",
        duracion: "",
        image: "",
      });

      obtenerDestinos();
    } catch (error) {
      console.error("Error al crear destino:", error);
    }
  };

  const eliminarDestino = async (id) => {
    try {
      await fetch(`http://localhost:5000/destinos/${id}`, { method: "DELETE" });
      setDestinos((prev) => prev.filter((d) => d._id !== id));
    } catch (error) {
      console.log("Error al eliminar destino:", error);
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="admin-container">
      {/* ======= COLUMNA IZQUIERDA: FORMULARIO DE DESTINOS ======= */}
      <div className="admin-form-area">
        <h1>Crear Destino</h1>
        <form onSubmit={(e) => { e.preventDefault(); crearDestino(); }}>
          {Object.keys(nuevoDestino).map((key) => (
            <input
              key={key}
              placeholder={key}
              type={key.includes("fecha") ? "date" : key.includes("hora") ? "time" : "text"}
              value={nuevoDestino[key]}
              onChange={(e) =>
                setNuevoDestino({ ...nuevoDestino, [key]: e.target.value })
              }
            />
          ))}
          <button type="submit">Agregar Destino</button>
        </form>

        {/* Tabla de destinos */}
        <h2>Lista de Destinos</h2>
        <div className="admin-table-area">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Origen</th>
                <th>Destino</th>
                <th>Fecha</th>
                <th>Precio</th>
                <th>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {destinos.map((d) => (
                <tr key={d._id}>
                  <td>{d.nombre}</td>
                  <td>{d.origen}</td>
                  <td>{d.destino}</td>
                  <td>{d.fecha_salida}</td>
                  <td>${d.precio}</td>
                  <td>
                    <button onClick={() => eliminarDestino(d._id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======= COLUMNA DERECHA: USUARIOS ======= */}
      <div className="admin-table-area">
        <h1>Usuarios Registrados</h1>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Registrado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u._id}>
                <td>{u.nombre}</td>
                <td>{u.correo}</td>
                <td>{u.rol}</td>
                <td>{new Date(u.createdAt).toLocaleString()}</td>
                <td>
                  <button onClick={() => cambiarRol(u._id, "admin")}>Hacer Admin</button>
                  <button onClick={() => cambiarRol(u._id, "cliente")}>Hacer Cliente</button>
                  <button onClick={() => eliminarUsuario(u._id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPage;
