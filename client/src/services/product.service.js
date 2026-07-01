import { BASE_URL, handleResponse } from "./auth.service.js";

const API = `${BASE_URL}/productos`;

// Obtiene todos los productos del catálogo
export async function obtenerProductos() {
  const response = await fetch(API);
  if (!response.ok) throw new Error("Error al obtener las prendas");
  return await response.json();
}

// Obtiene los detalles de una prenda por su ID
export async function obtenerProductoPorId(id) {
  const response = await fetch(`${API}/${id}`);
  if (!response.ok) throw new Error("Error al obtener detalles de la prenda");
  return await response.json();
}

// Crea una nueva prenda (Solo Administradores)
export async function crearProducto(producto) {
  const response = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(producto),
  });
  if (!response.ok) throw new Error("Error al registrar la prenda");
  return await response.json();
}

// Actualiza los datos de una prenda (Solo Administradores)
export async function actualizarProducto(id, producto) {
  const response = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(producto),
  });
  if (!response.ok) throw new Error("Error al actualizar la prenda");
  return await response.json();
}

// Elimina una prenda del inventario (Solo Administradores)
export async function eliminarProducto(id) {
  const response = await fetch(`${API}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error al eliminar la prenda");
}
