import { renderNavbar, setupNavbar } from "../../components/navbar.js";
import { renderFooter } from "../../components/footer.js";

export function renderNotFound() {
  return `
  ${renderNavbar()}
  
  <main class="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-24 bg-stone-50 dark:bg-stone-950 transition-colors">
    <div class="max-w-md">
      <span class="text-7xl">🪡</span>
      <h1 class="text-9xl font-black text-burgundy-850 dark:text-rosegold-500 font-serif mt-6">404</h1>
      <h2 class="text-2xl font-bold text-slate-800 dark:text-white mt-4 font-serif">Puntada Perdida</h2>
      <p class="text-slate-500 dark:text-stone-400 mt-4 leading-relaxed">
        Lo sentimos, la página que estás buscando no existe en nuestro SportZone o ha sido trasladada a otra colección.
      </p>
      <div class="mt-10">
        <a class="rounded-full bg-burgundy-850 hover:bg-burgundy-600 px-8 py-3.5 text-sm font-bold text-white transition-all shadow-md inline-block" 
           href="/" data-link>Regresar al Inicio</a>
      </div>
    </div>
  </main>
  
  ${renderFooter()}
  `;
}
