import { obtenerSesion, cerrarSesion } from "../services/auth.service.js";
import { renderThemeToggle, setupThemeToggle } from "../utils/theme.js";
import { obtenerCantidadTotal } from "../utils/cart.js";
import { navigate } from "../router/router.js";

export function renderNavbar() {
  const usuario = obtenerSesion();
  const cantCarrito = obtenerCantidadTotal();
  const badgeCartHtml = cantCarrito > 0 
    ? `<span id="cart-badge" class="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-sport-500 text-[10px] font-bold text-white ring-2 ring-zinc-50 dark:ring-zinc-950 animate-pulse">${cantCarrito}</span>`
    : "";

  let userNavHtml = "";
  if (usuario) {
    const isAdmin = usuario.role.includes("ADMIN");
    userNavHtml = `
      ${isAdmin ? `<a class="text-sm font-semibold hover:text-sport-400 transition-colors" href="/admin" data-link>Panel Admin</a>` : ""}
     
      
      <button id="logout-btn" class="rounded-full bg-sport-500 px-4 py-2 text-xs font-bold text-white hover:bg-sport-600 transition-all hover:scale-105" style="cursor: pointer;">Salir</button>
    `;
  } else {
    userNavHtml = `
      <a class="text-sm font-semibold hover:text-sport-400 transition-colors" href="/login" data-link>Iniciar Sesión</a>
      <a class="rounded-full bg-sport-500 px-4 py-2 text-xs font-bold text-white hover:bg-sport-600 transition-all hover:scale-105" href="/register" data-link>Registrarse</a>
    `;
  }

  return `
  <header class="bg-zinc-50/90 dark:bg-zinc-950/90 backdrop-blur-md sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-900 transition-colors">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
      <a class="flex items-center gap-2 text-xl font-bold tracking-tight text-sport-500 dark:text-sport-400 font-display" href="/" data-link>
        <span class="text-2xl">⚡</span> SportZone
      </a>
      <div class="flex items-center gap-6">
        <nav class="hidden md:flex items-center gap-5 text-slate-600 dark:text-stone-300">
          <a class="text-sm font-semibold hover:text-sport-400 transition-colors" href="/productos" data-link>Catálogo</a>
          ${userNavHtml}
        </nav>
        <div class="flex items-center gap-3">
          <!-- Shopping cart -->
          <a class="relative flex items-center justify-center w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all" href="/carrito" data-link aria-label="Ver Carrito">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            <div id="cart-badge-container">${badgeCartHtml}</div>
          </a>
          ${renderThemeToggle()}
          
          <!-- Mobile hamburger button -->
          <button id="mobile-menu-toggle" class="flex md:hidden items-center justify-center w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all" aria-label="Menú Móvil">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Mobile dropdown menu -->
    <div id="mobile-menu" class="hidden md:hidden border-t border-zinc-200 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-950 px-6 py-4 flex flex-col gap-4 text-slate-600 dark:text-stone-300">
      <a class="text-sm font-semibold hover:text-sport-400 transition-colors" href="/productos" data-link>Catálogo</a>
      ${usuario ? `
        ${usuario.role.includes("ADMIN") ? `<a class="text-sm font-semibold hover:text-sport-400 transition-colors" href="/admin" data-link>Panel Admin</a>` : ""}
        <a class="text-sm font-semibold hover:text-sport-400 transition-colors" href="/dashboard" data-link>Mis Pedidos</a>
        <a class="text-sm font-semibold hover:text-sport-400 transition-colors" href="/profile" data-link>Mi Perfil</a>
        <button id="mobile-logout-btn" class="w-full text-left rounded-full bg-sport-500 px-4 py-2 text-xs font-bold text-white hover:bg-sport-600 transition-all text-center">Salir</button>
      ` : `
        <a class="text-sm font-semibold hover:text-sport-400 transition-colors" href="/login" data-link>Iniciar Sesión</a>
        <a class="rounded-full bg-sport-500 px-4 py-2 text-xs font-bold text-white hover:bg-sport-600 transition-all text-center" href="/register" data-link>Registrarse</a>
      `}
    </div>
  </header>
  `;
}

export function setupNavbar() {
  setupThemeToggle();

  // Mobile menu toggle
  const mobileToggle = document.getElementById("mobile-menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }

  // Logout event (desktop)
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      cerrarSesion();
      navigate("/");
    });
  }

  // Logout event (mobile)
  const mobileLogoutBtn = document.getElementById("mobile-logout-btn");
  if (mobileLogoutBtn) {
    mobileLogoutBtn.addEventListener("click", () => {
      cerrarSesion();
      navigate("/");
    });
  }

  // Listen to cart changes to update badge
  window.addEventListener("cart-updated", () => {
    const container = document.getElementById("cart-badge-container");
    if (container) {
      const cant = obtenerCantidadTotal();
      container.innerHTML = cant > 0 
        ? `<span id="cart-badge" class="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-sport-500 text-[10px] font-bold text-white ring-2 ring-zinc-50 dark:ring-zinc-950 animate-pulse">${cant}</span>`
        : "";
    }
  });
}
