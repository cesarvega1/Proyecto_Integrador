export const BASE_URL = "https://sportzone-api-7y78.onrender.com";

console.log("BASE_URL:", BASE_URL);
export async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Error al conectar con la API");
  }
  return response.json();
}

// Register new user in database (with USER role)
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

// Login user with email and password
export async function loginUsuario(email, password) {
  const response = await fetch(`${BASE_URL}/users?email=${email}&password=${password}`);
  if (!response.ok) throw new Error("Error al conectar con la API");
  const usuarios = await response.json();
  return usuarios.length > 0 ? usuarios[0] : null;
}

// Save session in local storage
export function guardarSesion(usuario) {
  localStorage.setItem("usuario", JSON.stringify(usuario));
}

// Get current logged in user
export function obtenerSesion() {
  return JSON.parse(localStorage.getItem("usuario"));
}

// Logout user
export function cerrarSesion() {
  localStorage.removeItem("usuario");
}
