import { BASE_URL, handleResponse } from "./auth.service.js";

const API = `${BASE_URL}/ordenes`;

// Obtiene todas las órdenes (Para Administradores)
export async function obtenerOrdenes() {
  const response = await fetch(API);
  if (!response.ok) throw new Error("Error al obtener las órdenes de venta");
  return await response.json();
}

// Obtiene las órdenes de un usuario específico
export async function obtenerOrdenesPorUsuario(userId) {
  const response = await fetch(`${API}?userId=${userId}`);
  if (!response.ok) throw new Error("Error al obtener el historial de órdenes");
  return await response.json();
}

// Crea una orden. El backend descuenta automáticamente el stock de cada producto
// de forma atómica (transacción SQLite). Si no hay stock suficiente, lanza un error.
export async function crearOrden(orden) {
  const response = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orden),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Error al procesar la orden");
  }

  return await response.json();
}

// Actualiza el estado de una orden (Pendiente, En preparación, Enviado, Entregado, Cancelado)
export async function actualizarEstadoOrden(id, nuevoEstado) {
  const response = await fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estado: nuevoEstado }),
  });
  if (!response.ok) throw new Error("Error al actualizar el estado de la orden");
  return await response.json();
}
