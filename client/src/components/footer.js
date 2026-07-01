export function renderFooter() {
  return `
  <footer class="bg-stone-100 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-850 py-12 mt-20 transition-colors">
    <div class="mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div class="md:col-span-2">
        <a class="flex items-center gap-2 text-xl font-bold tracking-tight text-burgundy-800 dark:text-rosegold-400 font-serif" href="/" data-link>
          <span class="text-2xl">🧵</span> Modistería César Vega
        </a>
        <p class="mt-4 text-sm text-slate-500 dark:text-stone-400 max-w-md leading-relaxed">
          Bodega boutique dedicada al arte del diseño, corte y confección de prendas a medida. Fusionamos tradiciones clásicas de sastrería italiana con las últimas tendencias contemporáneas.
        </p>
      </div>
      <div>
        <h4 class="text-sm font-bold uppercase tracking-wider text-burgundy-800 dark:text-rosegold-400 font-serif mb-4">Explorar</h4>
        <ul class="flex flex-col gap-2.5 text-sm text-slate-600 dark:text-stone-400">
          <li><a class="hover:text-rosegold-500 transition-colors" href="/productos" data-link>Nueva Colección</a></li>
          <li><a class="hover:text-rosegold-500 transition-colors" href="/productos?categoria=Vestidos" data-link>Vestidos de Gala</a></li>
          <li><a class="hover:text-rosegold-500 transition-colors" href="/productos?categoria=Trajes" data-link>Sastrería e Hilados</a></li>
        </ul>
      </div>
      <div>
        <h4 class="text-sm font-bold uppercase tracking-wider text-burgundy-800 dark:text-rosegold-400 font-serif mb-4">Contacto & Soporte</h4>
        <ul class="flex flex-col gap-2.5 text-sm text-slate-600 dark:text-stone-400">
          <li>📍 Avenida de la Moda # 15-40, Bogotá</li>
          <li>📞 +57 (601) 321 4567</li>
          <li>✉️ info@ateliermodisteria.com</li>
        </ul>
      </div>
    </div>
    <div class="mx-auto max-w-7xl px-6 mt-8 pt-8 border-t border-stone-200 dark:border-stone-800 text-center text-xs text-slate-400">
      <div class="borde-hilado text-transparent mb-6 h-px"></div>
      <p>&copy; ${new Date().getFullYear()} Atelier & Modistería. Todos los derechos reservados. SPA modular de alto rendimiento.</p>
    </div>
  </footer>
  `;
}
