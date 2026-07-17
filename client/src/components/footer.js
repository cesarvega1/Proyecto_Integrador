export function renderFooter() {
  return `
  <footer class="bg-zinc-100 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 py-12 mt-20 transition-colors">
    <div class="mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div class="md:col-span-2">
        <a class="flex items-center gap-2 text-xl font-bold tracking-tight text-sport-500 dark:text-sport-400 font-display" href="/" data-link>
          <span class="text-2xl">⚡</span> SportZone
        </a>
        <p class="mt-4 text-sm text-slate-500 dark:text-stone-400 max-w-md leading-relaxed">
          Tu tienda deportiva online con el mejor catálogo de ropa técnica, calzado y accesorios para todos los deportes. Rendimiento al máximo, precio justo.
        </p>
      </div>
      <div>
        <h4 class="text-sm font-bold uppercase tracking-wider text-sport-500 dark:text-sport-400 font-display mb-4">Catálogo</h4>
        <ul class="flex flex-col gap-2.5 text-sm text-slate-600 dark:text-stone-400">
          <li><a class="hover:text-sport-400 transition-colors" href="/productos" data-link>Todos los Productos</a></li>
          <li><a class="hover:text-sport-400 transition-colors" href="/productos?categoria=Calzado" data-link>Calzado Deportivo</a></li>
          <li><a class="hover:text-sport-400 transition-colors" href="/productos?categoria=Camisetas" data-link>Camisetas Técnicas</a></li>
          <li><a class="hover:text-sport-400 transition-colors" href="/productos?categoria=Accesorios" data-link>Accesorios</a></li>
        </ul>
      </div>
      <div>
        <h4 class="text-sm font-bold uppercase tracking-wider text-sport-500 dark:text-sport-400 font-display mb-4">Contacto & Soporte</h4>
        <ul class="flex flex-col gap-2.5 text-sm text-slate-600 dark:text-stone-400">
          <li>📍 Local Esthercita Riwi</li>
          <li>📞 +57 310 258 7880</li>
          
        </ul>
      </div>
    </div>
    <div class="mx-auto max-w-7xl px-6 mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800 text-center text-xs text-slate-400">
      <p>&copy; ${new Date().getFullYear()} SportZone — Tienda Deportiva. Todos los derechos reservados.</p>
    </div>
  </footer>
  `;
}
