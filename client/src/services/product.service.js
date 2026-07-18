import { BASE_URL, handleResponse } from "./auth.service.js";

const API = `${BASE_URL}/productos`;

// Get all products
export async function obtenerProductos() {
  const response = await fetch(API);
  if (!response.ok) throw new Error("Error al obtener las prendas");
  return await response.json();
}

// Get product details by ID
export async function obtenerProductoPorId(id) {
  const response = await fetch(`${API}/${id}`);
  if (!response.ok) throw new Error("Error al obtener detalles de la prenda");
  return await response.json();
}

// Create new product (Admin only)
export async function crearProducto(producto) {
  const response = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(producto),
  });
  if (!response.ok) throw new Error("Error al registrar la prenda");
  return await response.json();
}

// Update product data (Admin only)
export async function actualizarProducto(id, producto) {
  const response = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(producto),
  });
  if (!response.ok) throw new Error("Error al actualizar la prenda");
  return await response.json();
}

// Delete product (Admin only)
export async function eliminarProducto(id) {
  const response = await fetch(`${API}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error al eliminar la prenda");
}
