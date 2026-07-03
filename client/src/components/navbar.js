import { obtenerSesion, cerrarSesion } from "../services/auth.service.js";
import { renderThemeToggle, setupThemeToggle } from "../utils/theme.js";
import { obtenerCantidadTotal } from "../utils/cart.js";
import { navigate } from "../router/router.js";
//cambios// 

export function renderNavbar() {
  const usuario = obtenerSesion();
  const cantCarrito = obtenerCantidadTotal();
  const badgeCartHtml = cantCarrito > 0 
    ? `<span id="cart-badge" class="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rosegold-500 text-[10px] font-bold text-white ring-2 ring-cream-50 dark:ring-stone-950 animate-pulse">${cantCarrito}</span>`
    : "";

  let userNavHtml = "";
  if (usuario) {
    const isAdmin = usuario.role.includes("ADMIN");
    userNavHtml = `
      ${isAdmin ? `<a class="text-sm font-semibold hover:text-rosegold-500 transition-colors" href="/admin" data-link>Panel Admin</a>` : ""}
     
      
      <button id="logout-btn" class="rounded-full bg-burgundy-800 px-4 py-2 text-xs font-bold text-white hover:bg-burgundy-600 transition-all hover:scale-105" style="cursor: pointer;">Salir</button>
    `;
  } else {
    userNavHtml = `
      <a class="text-sm font-semibold hover:text-rosegold-500 transition-colors" href="/login" data-link>Iniciar Sesión</a>
      <a class="rounded-full bg-burgundy-800 px-4 py-2 text-xs font-bold text-white hover:bg-burgundy-600 transition-all hover:scale-105" href="/register" data-link>Registrarse</a>
    `;
  }

  return `
  <header class="bg-cream-50/80 dark:bg-stone-950/80 backdrop-blur-md sticky top-0 z-50 border-b border-stone-200 dark:border-stone-900 transition-colors">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
      <a class="flex items-center gap-2 text-xl font-bold tracking-tight text-burgundy-800 dark:text-rosegold-400 font-serif" href="/" data-link>
        <span class="text-2xl">🧵</span> Couture Royale
      </a>
      <div class="flex items-center gap-6">
        <nav class="hidden md:flex items-center gap-5 text-slate-600 dark:text-stone-300">
          <a class="text-sm font-semibold hover:text-rosegold-500 transition-colors" href="/productos" data-link>Colección</a>
          ${userNavHtml}
        </nav>
        <div class="flex items-center gap-3">
          <!-- Carrito de compras -->
          <a class="relative flex items-center justify-center w-10 h-10 rounded-full border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 text-stone-800 dark:text-stone-100 hover:bg-stone-200 dark:hover:bg-stone-800 transition-all" href="/carrito" data-link aria-label="Ver Carrito">
            <span>🛒</span>
            <div id="cart-badge-container">${badgeCartHtml}</div>
          </a>
          ${renderThemeToggle()}
          
          <!-- Botón menú hamburguesa (móvil) -->
          <button id="mobile-menu-toggle" class="flex md:hidden items-center justify-center w-10 h-10 rounded-full border border-stone-200 dark:border-stone-800 text-stone-850 dark:text-stone-100 hover:bg-stone-200 dark:hover:bg-stone-800 transition-all" aria-label="Menú Móvil">
            <span class="text-lg">☰</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Menú Móvil desplegable -->
    <div id="mobile-menu" class="hidden md:hidden border-t border-stone-200 dark:border-stone-900 bg-cream-50 dark:bg-stone-950 px-6 py-4 flex flex-col gap-4 text-slate-600 dark:text-stone-300">
      <a class="text-sm font-semibold hover:text-rosegold-500 transition-colors" href="/productos" data-link>Colección</a>
      ${usuario ? `
        ${usuario.role.includes("ADMIN") ? `<a class="text-sm font-semibold hover:text-rosegold-500 transition-colors" href="/admin" data-link>Panel Admin</a>` : ""}
        <a class="text-sm font-semibold hover:text-rosegold-500 transition-colors" href="/dashboard" data-link>Mis Pedidos</a>
        <a class="text-sm font-semibold hover:text-rosegold-500 transition-colors" href="/profile" data-link>Mi Perfil</a>
        <button id="mobile-logout-btn" class="w-full text-left rounded-full bg-burgundy-800 px-4 py-2 text-xs font-bold text-white hover:bg-burgundy-600 transition-all text-center">Salir</button>
      ` : `
        <a class="text-sm font-semibold hover:text-rosegold-500 transition-colors" href="/login" data-link>Iniciar Sesión</a>
        <a class="rounded-full bg-burgundy-800 px-4 py-2 text-xs font-bold text-white hover:bg-burgundy-600 transition-all text-center" href="/register" data-link>Registrarse</a>
      `}
    </div>
  </header>
  `;
}

export function setupNavbar() {
  setupThemeToggle();

  // Menú móvil toggle
  const mobileToggle = document.getElementById("mobile-menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }

  // Evento cerrar sesión (escritorio)
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      cerrarSesion();
      navigate("/");
    });
  }

  // Evento cerrar sesión (móvil)
  const mobileLogoutBtn = document.getElementById("mobile-logout-btn");
  if (mobileLogoutBtn) {
    mobileLogoutBtn.addEventListener("click", () => {
      cerrarSesion();
      navigate("/");
    });
  }

  // Escuchar cambios en el carrito para actualizar la burbuja en tiempo real
  window.addEventListener("cart-updated", () => {
    const container = document.getElementById("cart-badge-container");
    if (container) {
      const cant = obtenerCantidadTotal();
      container.innerHTML = cant > 0 
        ? `<span id="cart-badge" class="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rosegold-500 text-[10px] font-bold text-white ring-2 ring-cream-50 dark:ring-stone-950 animate-pulse">${cant}</span>`
        : "";
    }
  });
}
