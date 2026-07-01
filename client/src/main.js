import "./styles/global.css";
import { initRouter, renderRoute, navigate } from "./router/router.js";
import { initTheme } from "./utils/theme.js";

// Inicializa el tema (Oscuro/Claro) según la preferencia persistente
initTheme();

// Arranca el enrutador escuchando popstate del navegador
initRouter();

// Renderiza la vista inicial de la ruta cargada
renderRoute();

// Intercepta clics globales de enlaces marcados con data-link
document.addEventListener("click", (e) => {
  const link = e.target.closest("[data-link]");
  if (link) {
    e.preventDefault();
    navigate(link.getAttribute("href"));
  }
});
