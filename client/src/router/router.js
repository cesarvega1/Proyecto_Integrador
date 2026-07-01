import routes from "./routes.js";

const app = document.getElementById("app");

// Navega a una ruta sin recargar la página
export function navigate(path) {
  window.history.pushState({}, "", path);
  renderRoute();
}

// Renderiza la vista según la ruta actual
export function renderRoute() {
  const path = window.location.pathname;
  
  // Buscar si coincide con una ruta dinámica como /producto/:id
  let matchedRouteKey = path;
  let params = {};

  // Soporte básico para rutas dinámicas como /producto/:id
  for (const key of Object.keys(routes)) {
    if (key.includes("/:") ) {
      const parts = key.split("/:");
      const routePrefix = parts[0]; // e.g. "/producto"
      const paramName = parts[1]; // e.g. "id"

      if (path.startsWith(routePrefix + "/") || path === routePrefix) {
        matchedRouteKey = key;
        const idVal = path.slice(routePrefix.length + 1);
        params[paramName] = idVal;
        break;
      }
    }
  }

  const route = routes[matchedRouteKey];

  if (!route) {
    app.innerHTML = routes["/notFound"].render();
    routes["/notFound"].setup?.();
    return;
  }

  // Verificar autenticación
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (route.protected && !usuario) {
    navigate("/login");
    return;
  }

  // Verificar si es solo para administradores
  if (route.adminOnly) {
    if (!usuario || !usuario.role.includes("ADMIN")) {
      navigate("/");
      return;
    }
  }

  // Renderizar e inyectar el HTML
  app.innerHTML = route.render(params);

  // Ejecutar lógica adicional de la vista
  route.setup?.(params);
  
  // Scroll hacia la parte superior al cambiar de página
  window.scrollTo(0, 0);
}

// Escucha popstate para cuando el usuario usa atrás/adelante en el navegador
export function initRouter() {
  window.addEventListener("popstate", renderRoute);
}
