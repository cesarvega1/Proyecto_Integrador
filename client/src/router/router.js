import routes from "./routes.js";

const app = document.getElementById("app");

// Go to page without reload
export function navigate(path) {
  window.history.pushState({}, "", path);
  renderRoute();
}

// Show view for current page
export function renderRoute() {
  const path = window.location.pathname;
  
  // Find dynamic routes like /producto/:id
  let matchedRouteKey = path;
  let params = {};

  // Basic support for dynamic routes
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

  // Check login
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (route.protected && !usuario) {
    navigate("/login");
    return;
  }

  // Check if admin only
  if (route.adminOnly) {
    if (!usuario || !usuario.role.includes("ADMIN")) {
      navigate("/");
      return;
    }
  }

  // Show HTML
  app.innerHTML = route.render(params);

  // Run page logic
  route.setup?.(params);
  
  // Go to top on page change
  window.scrollTo(0, 0);
}

// Listen for back/forward buttons
export function initRouter() {
  window.addEventListener("popstate", renderRoute);
}
