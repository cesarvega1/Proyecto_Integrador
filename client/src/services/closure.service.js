import { BASE_URL, handleResponse } from "./auth.service.js";

const API = `${BASE_URL}/cierres`;

// Get all closings
export async function obtenerCierres() {
  const response = await fetch(API);
  if (!response.ok) throw new Error("Error al obtener cierres");
  return await response.json();
}

// Create new closing
export async function crearCierre() {
  const response = await fetch(API, {
    method: "POST"
  });
  if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Error al realizar el cierre");
  }
  return await response.json();
}
