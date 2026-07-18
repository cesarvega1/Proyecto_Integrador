import "./styles/global.css";
import { initRouter, renderRoute, navigate } from "./router/router.js";
import { initTheme } from "./utils/theme.js";

// Start theme (Dark/Light)
initTheme();

// Start router
initRouter();

// Show first view
renderRoute();

// Catch clicks on links
document.addEventListener("click", (e) => {
  const link = e.target.closest("[data-link]");
  if (link) {
    e.preventDefault();
    navigate(link.getAttribute("href"));
  }
});
