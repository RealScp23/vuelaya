import React, { useEffect, useState } from "react";
import "./admin.css";

function AdminPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    obtenerUsuarios();
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
      await fetch(`http://localhost:5000/usuarios/${id}`, {
        method: "DELETE",
      });

      setUsuarios((prev) => prev.filter((u) => u._id !== id));
    } catch (error) {
      console.log("Error al eliminar usuario:", error);
    }
  };

  if (loading) return <p>Cargando usuarios...</p>;

  return (
    <div className="admin-container">
      <h1>Panel de Administrador</h1>
      <h2>Usuarios Registrados</h2>

      {/* 🔥 Contenedor del scroll que tu CSS requiere */}
      <div className="admin-scroll-area">
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
                  <button onClick={() => cambiarRol(u._id, "admin")}>
                    Hacer Admin
                  </button>

                  <button onClick={() => cambiarRol(u._id, "cliente")}>
                    Hacer Cliente
                  </button>

                  <button onClick={() => eliminarUsuario(u._id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Fin scroll */}
    </div>
  );
}

export default AdminPage;
