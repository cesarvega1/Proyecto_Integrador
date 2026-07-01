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

// Crea una orden y actualiza automáticamente el stock de los productos comprados
export async function crearOrden(orden) {
  // 1. Crear el registro de la orden
  const response = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orden),
  });
  if (!response.ok) throw new Error("Error al procesar la orden");
  const nuevaOrden = await response.json();

  // 2. Descontar stock para cada producto
  for (const item of orden.productos) {
    try {
      // Obtener el producto actual
      const prodRes = await fetch(`${BASE_URL}/productos/${item.productoId}`);
      if (prodRes.ok) {
        const producto = await prodRes.json();
        const nuevoStock = Math.max(0, producto.stock - item.cantidad);
        
        // Actualizar stock mediante PATCH
        await fetch(`${BASE_URL}/productos/${item.productoId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stock: nuevoStock })
        });
      }
    } catch (err) {
      console.error(`No se pudo actualizar el stock del producto ${item.productoId}:`, err);
    }
  }

  return nuevaOrden;
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
