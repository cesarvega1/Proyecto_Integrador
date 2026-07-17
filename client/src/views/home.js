import { obtenerSesion } from "../services/auth.service.js";
import { renderNavbar, setupNavbar } from "../components/navbar.js";
import { renderFooter } from "../components/footer.js";

export function renderHome() {
  const usuario = obtenerSesion();

  return `
  ${renderNavbar()}

  <main class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative flex flex-col lg:flex-row min-h-[85vh] items-center bg-zinc-950 overflow-hidden transition-colors">
      <!-- Fondo decorativo -->
      <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(ellipse at 80% 50%, #e05c1a 0%, transparent 60%)"></div>

      <!-- Mitad Texto -->
      <div class="relative z-10 flex-1 px-6 py-20 lg:px-16 xl:px-24 flex flex-col justify-center">
        <span class="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-sport-400 mb-8">
          <span class="w-8 h-px bg-sport-400"></span>
          Tu Tienda Deportiva Online
        </span>
        <h1 class="text-5xl font-black tracking-tight text-white sm:text-6xl md:text-7xl font-display uppercase leading-none">
          Rinde al<br>
          <span class="text-sport-400">máximo</span><br>
          nivel
        </h1>
        <p class="mt-8 text-lg text-zinc-300 max-w-xl leading-relaxed font-sans font-light">
          Equipate con la mejor ropa técnica, calzado y accesorios deportivos. Todo lo que necesitas para entrenar, competir y ganar.
        </p>
        <div class="mt-12 flex flex-wrap items-center gap-6">
          <a class="rounded-full bg-sport-500 hover:bg-sport-600 px-8 py-4 text-sm font-bold text-white transition-all hover:shadow-xl hover:-translate-y-1 hover:shadow-sport-500/30" 
             href="/productos" data-link>
            ⚡ Ver Catálogo
          </a>
          
          ${usuario ? `
            
          ` : `
            <a class="group flex items-center gap-2 text-sm font-semibold text-zinc-300 hover:text-sport-400 transition-colors" 
               href="/login" data-link>
               Iniciar Sesión <span class="transition-transform group-hover:translate-x-1">→</span>
            </a>
          `}
        </div>

          <!-- Stats rápidos -->
          <div class="mt-16 flex flex-wrap gap-10">
            <div>
              <p class="text-3xl font-black text-sport-400 font-display"></p>
              <p class="text-xs text-zinc-400 uppercase tracking-wider mt-1"></p>
            </div>
            <div>
              <p class="text-3xl font-black text-sport-400 font-display"></p>
              <p class="text-xs text-zinc-400 uppercase tracking-wider mt-1"></p>
            </div>
            <div>
              <p class="text-3xl font-black text-sport-400 font-display"></p>
              <p class="text-xs text-zinc-400 uppercase tracking-wider mt-1"></p>
            </div>
          </div>
        </div>
      
      <!-- Mitad Imagen -->
      <div class="flex-1 w-full lg:w-1/2 h-[60vh] lg:h-[85vh] relative">
        <div class="absolute inset-0 bg-gradient-to-r from-zinc-950 to-transparent z-10 lg:block"></div>
        <img src="https://brand.assets.adidas.com/image/upload/f_auto,q_auto:best,fl_lossy/if_w_gt_800,w_800/7361768_CAM_LAM_FTD_SS_26_MAY_29_FOOTBALL_WC_KICK_OFF_ONSITE_TEASER_CAROUSEL_1050x1400_CO_5d65cbafe6.png"
             alt="Deportista en acción" class="w-full h-full object-cover object-center" />
      </div>
    </section>

    <!-- Sección de Categorías -->
    <section class="mx-auto max-w-7xl px-6 py-24">
      <div class="text-center max-w-2xl mx-auto mb-16">
        <span class="text-xs font-bold uppercase tracking-widest text-sport-500">Explora por deporte</span>
        <h2 class="text-4xl font-black uppercase text-zinc-900 dark:text-white font-display sm:text-5xl mt-2">Categorías</h2>
        <div class="stripe-line text-sport-500 mx-auto mt-4 w-20"></div>
        <p class="mt-4 text-slate-500 dark:text-stone-400">Filtra por tipo de producto y encuentra lo que necesitas.</p>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <!-- Camisetas -->
        <a href="/productos?categoria=Camisetas" data-link class="group relative h-64 rounded-2xl overflow-hidden flex flex-col justify-end p-5 border border-zinc-200 dark:border-zinc-800 hover:border-sport-500 shadow-sm transition-all hover:-translate-y-1">
          <div class="absolute inset-0 bg-zinc-900/50 group-hover:bg-zinc-900/70 transition-colors z-10"></div>
          <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&auto=format&fit=crop&q=80" 
               class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Camisetas" />
          <h3 class="relative z-20 text-base font-black text-white font-display uppercase">Camisetas</h3>
          <p class="relative z-20 text-xs text-zinc-300 mt-0.5">Ver productos ➔</p>
        </a>

        <!-- Calzado -->
        <a href="/productos?categoria=Calzado" data-link class="group relative h-64 rounded-2xl overflow-hidden flex flex-col justify-end p-5 border border-zinc-200 dark:border-zinc-800 hover:border-sport-500 shadow-sm transition-all hover:-translate-y-1">
          <div class="absolute inset-0 bg-zinc-900/50 group-hover:bg-zinc-900/70 transition-colors z-10"></div>
          <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop&q=80" 
               class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Calzado" />
          <h3 class="relative z-20 text-base font-black text-white font-display uppercase">Calzado</h3>
          <p class="relative z-20 text-xs text-zinc-300 mt-0.5">Ver productos ➔</p>
        </a>

        <!-- Pantalonetas -->
        <a href="/productos?categoria=Pantalonetas" data-link class="group relative h-64 rounded-2xl overflow-hidden flex flex-col justify-end p-5 border border-zinc-200 dark:border-zinc-800 hover:border-sport-500 shadow-sm transition-all hover:-translate-y-1">
          <div class="absolute inset-0 bg-zinc-900/50 group-hover:bg-zinc-900/70 transition-colors z-10"></div>
          <img src="https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=300&auto=format&fit=crop&q=80" 
               class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Pantalonetas" />
          <h3 class="relative z-20 text-base font-black text-white font-display uppercase">Pantalonetas</h3>
          <p class="relative z-20 text-xs text-zinc-300 mt-0.5">Ver productos ➔</p>
        </a>

        <!-- Balones -->
        <a href="/productos?categoria=Balones" data-link class="group relative h-64 rounded-2xl overflow-hidden flex flex-col justify-end p-5 border border-zinc-200 dark:border-zinc-800 hover:border-sport-500 shadow-sm transition-all hover:-translate-y-1">
          <div class="absolute inset-0 bg-zinc-900/50 group-hover:bg-zinc-900/70 transition-colors z-10"></div>
          <img src="https://http2.mlstatic.com/D_Q_NP_824478-CBT102655641608_122025-O.webp" 
               class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Balones" />
          <h3 class="relative z-20 text-base font-black text-white font-display uppercase">Balones</h3>
          <p class="relative z-20 text-xs text-zinc-300 mt-0.5">Ver productos ➔</p>
        </a>

        <!-- Accesorios -->
        <a href="/productos?categoria=Accesorios" data-link class="group relative h-64 rounded-2xl overflow-hidden flex flex-col justify-end p-5 border border-zinc-200 dark:border-zinc-800 hover:border-sport-500 shadow-sm transition-all hover:-translate-y-1">
          <div class="absolute inset-0 bg-zinc-900/50 group-hover:bg-zinc-900/70 transition-colors z-10"></div>
          <img src="https://images.unsplash.com/photo-1555597673-b21d5c935865?w=300&auto=format&fit=crop&q=80" 
               class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Accesorios" />
          <h3 class="relative z-20 text-base font-black text-white font-display uppercase">Accesorios</h3>
          <p class="relative z-20 text-xs text-zinc-300 mt-0.5">Ver productos ➔</p>
        </a>

        <!-- Chaquetas -->
        <a href="/productos?categoria=Chaquetas" data-link class="group relative h-64 rounded-2xl overflow-hidden flex flex-col justify-end p-5 border border-zinc-200 dark:border-zinc-800 hover:border-sport-500 shadow-sm transition-all hover:-translate-y-1">
          <div class="absolute inset-0 bg-zinc-900/50 group-hover:bg-zinc-900/70 transition-colors z-10"></div>
          <img src="https://www.sportline.com.co/media/catalog/product/8/6/86m626-023_frontf1-001.jpg?optimize=medium&bg-color=255,255,255&fit=bounds&height=&width=&canvas=:" 
               class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Chaquetas" />
          <h3 class="relative z-20 text-base font-black text-white font-display uppercase">Chaquetas</h3>
          <p class="relative z-20 text-xs text-zinc-300 mt-0.5">Ver productos ➔</p>
        </a>
      </div>
    </section>

    <!-- Propósitos y Valores -->
    <section class="bg-zinc-100 dark:bg-zinc-900 py-24 transition-colors">
      <div class="mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="p-8 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:border-sport-500/50 transition-colors group">
          <div class="w-12 h-12 rounded-2xl bg-sport-100 dark:bg-sport-950/40 flex items-center justify-center text-2xl mb-6">🤼‍♂️</div>
          <h3 class="text-xl font-black uppercase text-zinc-900 dark:text-white mb-3 font-display">Rendimiento</h3>
          <p class="text-slate-500 dark:text-stone-400 text-sm leading-relaxed">
            Todos nuestros productos están diseñados para maximizar tu rendimiento deportivo, con materiales técnicos de última generación.
          </p>
        </div>
        <div class="p-8 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:border-sport-500/50 transition-colors group">
          <div class="w-12 h-12 rounded-2xl bg-sport-100 dark:bg-sport-950/40 flex items-center justify-center text-2xl mb-6">📦</div>
          <h3 class="text-xl font-black uppercase text-zinc-900 dark:text-white mb-3 font-display">Envío Rápido</h3>
          <p class="text-slate-500 dark:text-stone-400 text-sm leading-relaxed">
            Despacho en 24 horas hábiles a todo el territorio nacional. Rastreo en tiempo real de tu pedido y garantía de entrega.
          </p>
        </div>
        <div class="p-8 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:border-sport-500/50 transition-colors group">
          <div class="w-12 h-12 rounded-2xl bg-sport-100 dark:bg-sport-950/40 flex items-center justify-center text-2xl mb-6">🔝</div>
          <h3 class="text-xl font-black uppercase text-zinc-900 dark:text-white mb-3 font-display">Marcas Top</h3>
          <p class="text-slate-500 dark:text-stone-400 text-sm leading-relaxed">
            Trabajamos con las mejores marcas deportivas del mercado para garantizarte calidad premium en cada artículo que adquieras.
          </p>
        </div>
      </div>
    </section>
  </main>

  ${renderFooter()}
  `;
}

export function setupHome() {
  setupNavbar();
}
