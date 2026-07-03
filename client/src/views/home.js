import { obtenerSesion } from "../services/auth.service.js";
import { renderNavbar, setupNavbar } from "../components/navbar.js";
import { renderFooter } from "../components/footer.js";

export function renderHome() {
  const usuario = obtenerSesion();

  return `
  ${renderNavbar()}

  <main class="min-h-screen">
    <!-- Hero Section Minimalista/Split -->
    <section class="relative flex flex-col lg:flex-row min-h-[85vh] items-center bg-stone-50 dark:bg-stone-950 overflow-hidden transition-colors">
      <!-- Mitad Texto -->
      <div class="relative z-10 flex-1 px-6 py-20 lg:px-16 xl:px-24 flex flex-col justify-center">
        <span class="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-burgundy-700 dark:text-rosegold-400 mb-8">
          <span class="w-8 h-px bg-burgundy-700 dark:bg-rosegold-400"></span>
          Bodega Boutique & Atelier
        </span>
        <h1 class="text-5xl font-light tracking-tight text-stone-900 dark:text-white sm:text-6xl md:text-7xl font-serif">
          La esencia de la <br>
          <span class="font-medium italic text-burgundy-800 dark:text-rosegold-300">alta costura</span>
        </h1>
        <p class="mt-8 text-lg text-stone-600 dark:text-stone-300 max-w-xl leading-relaxed font-sans font-light">
          Redefinimos la elegancia con piezas atemporales. Diseños sofisticados, telas importadas y un nivel de detalle que solo los verdaderos artesanos pueden lograr.
        </p>
        <div class="mt-12 flex flex-wrap items-center gap-8">
          <a class="rounded-full bg-stone-900 dark:bg-stone-100 px-8 py-4 text-sm font-medium text-white dark:text-stone-900 transition-all hover:bg-burgundy-800 dark:hover:bg-rosegold-300 hover:shadow-xl hover:-translate-y-1" 
             href="/productos" data-link>
            Explorar Colección
          </a>
          
          ${usuario ? `
            
          ` : `
            <a class="group flex items-center gap-2 text-sm font-medium text-stone-900 dark:text-white transition-colors hover:text-burgundy-700 dark:hover:text-rosegold-400" 
               href="/login" data-link>
               Iniciar Sesión <span class="transition-transform group-hover:translate-x-1">→</span>
            </a>
          `}
        </div>
      </div>
      
      <!-- Mitad Imagen -->
      <div class="flex-1 w-full lg:w-1/2 h-[60vh] lg:h-[85vh] relative">
        <div class="absolute inset-0 bg-stone-900/5 z-10 dark:bg-black/20"></div>
        <img src="https://brand.assets.adidas.com/image/upload/f_auto,q_auto:best,fl_lossy/if_w_gt_800,w_800/7361768_CAM_LAM_FTD_SS_26_MAY_29_FOOTBALL_WC_KICK_OFF_ONSITE_TEASER_CAROUSEL_1050x1400_CO_5d65cbafe6.png" 
             alt="Alta Costura" class="w-full h-full object-cover object-center" />
        <!-- Floating badge -->
        
          </div>
        </div>
      </div>
    </section>

    <!-- Sección de Categorías Destacadas -->
    <section class="mx-auto max-w-7xl px-6 py-24">
      <div class="text-center max-w-2xl mx-auto mb-16">
        <h2 class="text-3xl font-bold tracking-tight text-burgundy-800 dark:text-rosegold-400 font-serif sm:text-4xl">Categorías de Alta Costura</h2>
        <div class="w-16 h-1 bg-rosegold-500 mx-auto mt-4 rounded-full"></div>
        <p class="mt-4 text-slate-500 dark:text-stone-400">Selecciona el tipo de confección para filtrar nuestro catálogo exclusivo.</p>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-5 gap-6">
        <!-- Vestidos -->
        <a href="/productos?categoria=Vestidos" data-link class="group relative h-72 rounded-2xl overflow-hidden flex flex-col justify-end p-6 border border-stone-250 dark:border-stone-850 hover:border-rosegold-500 shadow-sm transition-all hover:-translate-y-1">
          <div class="absolute inset-0 bg-stone-900/40 group-hover:bg-stone-900/60 transition-colors z-10"></div>
          <img src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&auto=format&fit=crop&q=80" 
               class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Vestidos" />
          <h3 class="relative z-20 text-lg font-bold text-white font-serif">Vestidos</h3>
          <p class="relative z-20 text-xs text-stone-200 mt-1">Ver piezas ➔</p>
        </a>

        <!-- Trajes -->
        <a href="/productos?categoria=Trajes" data-link class="group relative h-72 rounded-2xl overflow-hidden flex flex-col justify-end p-6 border border-stone-250 dark:border-stone-850 hover:border-rosegold-500 shadow-sm transition-all hover:-translate-y-1">
          <div class="absolute inset-0 bg-stone-900/40 group-hover:bg-stone-900/60 transition-colors z-10"></div>
          <img src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&auto=format&fit=crop&q=80" 
               class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Trajes" />
          <h3 class="relative z-20 text-lg font-bold text-white font-serif">Trajes</h3>
          <p class="relative z-20 text-xs text-stone-200 mt-1">Ver piezas ➔</p>
        </a>

        <!-- Blusas -->
        <a href="/productos?categoria=Blusas" data-link class="group relative h-72 rounded-2xl overflow-hidden flex flex-col justify-end p-6 border border-stone-250 dark:border-stone-850 hover:border-rosegold-500 shadow-sm transition-all hover:-translate-y-1">
          <div class="absolute inset-0 bg-stone-900/40 group-hover:bg-stone-900/60 transition-colors z-10"></div>
          <img src="https://images.unsplash.com/photo-1548624149-f9b1859aa7d0?w=300&auto=format&fit=crop&q=80" 
               class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Blusas" />
          <h3 class="relative z-20 text-lg font-bold text-white font-serif">Blusas</h3>
          <p class="relative z-20 text-xs text-stone-200 mt-1">Ver piezas ➔</p>
        </a>

        <!-- Faldas -->
        <a href="/productos?categoria=Faldas" data-link class="group relative h-72 rounded-2xl overflow-hidden flex flex-col justify-end p-6 border border-stone-250 dark:border-stone-850 hover:border-rosegold-500 shadow-sm transition-all hover:-translate-y-1">
          <div class="absolute inset-0 bg-stone-900/40 group-hover:bg-stone-900/60 transition-colors z-10"></div>
          <img src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=300&auto=format&fit=crop&q=80" 
               class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Faldas" />
          <h3 class="relative z-20 text-lg font-bold text-white font-serif">Faldas</h3>
          <p class="relative z-20 text-xs text-stone-200 mt-1">Ver piezas ➔</p>
        </a>

        <!-- Sacos -->
        <a href="/productos?categoria=Sacos" data-link class="group relative h-72 rounded-2xl overflow-hidden flex flex-col justify-end p-6 border border-stone-250 dark:border-stone-850 hover:border-rosegold-500 shadow-sm transition-all hover:-translate-y-1">
          <div class="absolute inset-0 bg-stone-900/40 group-hover:bg-stone-900/60 transition-colors z-10"></div>
          <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80" 
               class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Sacos" />
          <h3 class="relative z-20 text-lg font-bold text-white font-serif">Sacos</h3>
          <p class="relative z-20 text-xs text-stone-200 mt-1">Ver piezas ➔</p>
        </a>
      </div>
    </section>

    <!-- Propósitos y Valores del Atelier -->
    <section class="bg-stone-100 dark:bg-stone-900 py-24 transition-colors">
      <div class="mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="p-8 rounded-3xl bg-cream-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-850 hover:border-rosegold-500/50 transition-colors group">
          <div class="w-12 h-12 rounded-2xl bg-burgundy-100 dark:bg-burgundy-950 flex items-center justify-center text-2xl mb-6">🪡</div>
          <h3 class="text-xl font-bold text-burgundy-850 dark:text-rosegold-400 mb-3 font-serif">Costura de Precisión</h3>
          <p class="text-slate-500 dark:text-stone-400 text-sm leading-relaxed">
            Cada costura y dobladillo se elabora siguiendo los métodos más estrictos del arte de la modistería artesanal, asegurando caídas y hormas sublimes.
          </p>
        </div>
        <div class="p-8 rounded-3xl bg-cream-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-850 hover:border-rosegold-500/50 transition-colors group">
          <div class="w-12 h-12 rounded-2xl bg-rosegold-100 dark:bg-rosegold-900/30 flex items-center justify-center text-2xl mb-6">🧣</div>
          <h3 class="text-xl font-bold text-burgundy-850 dark:text-rosegold-400 mb-3 font-serif">Telas Seleccionadas</h3>
          <p class="text-slate-500 dark:text-stone-400 text-sm leading-relaxed">
            Trabajamos únicamente con fibras nobles, sedas naturales, lanas vírgenes y algodones peinados para dotar a las prendas de gran suavidad y resistencia.
          </p>
        </div>
        <div class="p-8 rounded-3xl bg-cream-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-850 hover:border-rosegold-500/50 transition-colors group">
          <div class="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center text-2xl mb-6">✨</div>
          <h3 class="text-xl font-bold text-burgundy-850 dark:text-rosegold-400 mb-3 font-serif">Detalle a Medida</h3>
          <p class="text-slate-500 dark:text-stone-400 text-sm leading-relaxed">
            Habilitamos la personalización de colores y tallajes en cada pedido. Tu prenda será confeccionada y despachada con un empaque de lujo numerado.
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
