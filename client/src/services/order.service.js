import { BASE_URL, handleResponse } from "./auth.service.js";

const API = `${BASE_URL}/ordenes`;

// Get all orders (For Admins)
export async function obtenerOrdenes() {
  const response = await fetch(API);
  if (!response.ok) throw new Error("Error al obtener las órdenes de venta");
  return await response.json();
}

// Get user orders
export async function obtenerOrdenesPorUsuario(userId) {
  const response = await fetch(`${API}?userId=${userId}`);
  if (!response.ok) throw new Error("Error al obtener el historial de órdenes");
  return await response.json();
}

// Create an order. Backend reduces stock automatically
// atomically. If not enough stock, throws error.
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

// Update order status
export async function actualizarEstadoOrden(id, nuevoEstado) {
  const response = await fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estado: nuevoEstado }),
  });
  if (!response.ok) throw new Error("Error al actualizar el estado de la orden");
  return await response.json();
}
