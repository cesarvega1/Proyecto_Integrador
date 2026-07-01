export const BASE_URL = "http://localhost:3000";

export async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Error al conectar con la API");
  }
  return response.json();
}

// Registra un nuevo usuario en la base de datos (con rol USER por defecto)
export async function registrarUsuario(usuario) {
  const nuevoUsuario = {
    ...usuario,
    role: ["USER"]
  };
  const response = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevoUsuario),
  });
  return handleResponse(response);
}

// Inicia sesión buscando el correo y contraseña del usuario
export async function loginUsuario(email, password) {
  const response = await fetch(`${BASE_URL}/users?email=${email}&password=${password}`);
  if (!response.ok) throw new Error("Error al conectar con la API");
  const usuarios = await response.json();
  return usuarios.length > 0 ? usuarios[0] : null;
}

// Guarda la sesión en localStorage
export function guardarSesion(usuario) {
  localStorage.setItem("usuario", JSON.stringify(usuario));
}

// Devuelve el usuario actualmente autenticado
export function obtenerSesion() {
  return JSON.parse(localStorage.getItem("usuario"));
}

// Cierra sesión
export function cerrarSesion() {
  localStorage.removeItem("usuario");
}
