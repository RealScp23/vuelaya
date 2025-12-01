import React, { useEffect, useState } from "react";
import "./Toast.css";

export default function Toast({ mensaje, duracion = 4000 }) {
  const [show, setShow] = useState(false); // controla clases CSS
  const [mounted, setMounted] = useState(true); // controla render

  useEffect(() => {
    // Entrada
    const enterTimer = setTimeout(() => setShow(true), 50); // pequeño delay para disparar transición

    // Salida
    const leaveTimer = setTimeout(() => setShow(false), duracion);

    // Desmontar después de animación
    const unmountTimer = setTimeout(() => setMounted(false), duracion + 500);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(leaveTimer);
      clearTimeout(unmountTimer);
    };
  }, [mensaje, duracion]);

  if (!mounted) return null;

  return <div className={`toast ${show ? "show" : "hide"}`}>{mensaje}</div>;
}
