export function renderFooter() {
  return `
  <footer class="bg-zinc-100 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 py-12 mt-20 transition-colors">
    <div class="mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div class="md:col-span-2">
        <a class="flex items-center gap-2 text-xl font-bold tracking-tight text-sport-500 dark:text-sport-400 font-display" href="/" data-link>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg> 
          SportZone
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
          <li class="flex items-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> Local Esthercita Riwi</li>
          <li class="flex items-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg> +57 310 258 7880</li>
          
        </ul>
      </div>
    </div>
    <div class="mx-auto max-w-7xl px-6 mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800 text-center text-xs text-slate-400">
      <p>&copy; ${new Date().getFullYear()} SportZone — Tienda Deportiva. Todos los derechos reservados.</p>
    </div>
  </footer>
  `;
}
