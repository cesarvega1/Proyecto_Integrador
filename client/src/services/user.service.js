import { BASE_URL, handleResponse } from "./auth.service.js";

const API = `${BASE_URL}/users`;

// Obtiene todos los usuarios
export async function obtenerUsuarios() {
  const response = await fetch(API);
  if (!response.ok) throw new Error("Error al obtener la lista de usuarios");
  return await response.json();
}

// Obtiene un usuario específico por su ID
export async function obtenerUsuarioPorId(id) {
  const response = await fetch(`${API}/${id}`);
  if (!response.ok) throw new Error("Error al obtener datos del usuario");
  return await response.json();
}

// Actualiza los datos del perfil de un usuario
export async function actualizarUsuario(id, datos) {
  const response = await fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  if (!response.ok) throw new Error("Error al actualizar los datos del usuario");
  return await response.json();
}

// Cambia el rol de un usuario (Ej. de USER a ADMIN)
export async function actualizarRolUsuario(id, roles) {
  const response = await fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role: roles }),
  });
  if (!response.ok) throw new Error("Error al actualizar el rol del usuario");
  return await response.json();
}
