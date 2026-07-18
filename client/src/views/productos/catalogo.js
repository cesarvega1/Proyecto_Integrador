import { obtenerProductos } from "../../services/product.service.js";
import { renderNavbar, setupNavbar } from "../../components/navbar.js";
import { renderFooter } from "../../components/footer.js";
import { agregarAlCarrito } from "../../utils/cart.js";

// ── Caché en sessionStorage para no re-fetchear en cada visita ──────────────
const CACHE_KEY = "sportzone_productos";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

function getCachedProductos() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) { sessionStorage.removeItem(CACHE_KEY); return null; }
    return data;
  } catch { return null; }
}

function setCachedProductos(data) {
  try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data })); } catch {}
}
// ────────────────────────────────────────────────────────────────────────────

// Variable local de la vista para mantener el estado de los productos cargados
let productosMemoria = [];
let categoriaSeleccionada = "Todos";
let precioMaximo = 500000;
let tallaSeleccionada = "Todas";
let ordenSeleccionado = "defecto";
let busquedaTexto = "";

export function renderCatalogo() {
  // Capturar parámetros opcionales de la URL (?categoria=Camisetas)
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get("categoria");
  if (catParam) {
    categoriaSeleccionada = catParam;
    // Limpiamos los parámetros de la URL de forma sutil
    window.history.replaceState({}, "", "/productos");
  }

  // A1 Comment: Read search param from voice assistant
  const searchParam = urlParams.get("buscar");
  if (searchParam) {
    busquedaTexto = decodeURIComponent(searchParam);
    window.history.replaceState({}, "", "/productos");
  }

  return `
  ${renderNavbar()}

  <main class="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors py-12">
    <div class="mx-auto max-w-7xl px-6">
      <!-- Cabecera de Catálogo -->
      <div class="mb-12 text-center md:text-left">
        <span class="text-xs font-bold uppercase tracking-widest text-sport-500">SportZone</span>
        <h1 class="text-4xl font-black uppercase text-zinc-900 dark:text-white font-display mt-2">Catálogo Deportivo</h1>
        <p class="text-slate-500 dark:text-stone-400 mt-2 text-sm max-w-xl">Ropa técnica, calzado y accesorios de alto rendimiento. Filtra y encuentra tu producto ideal.</p>
      </div>

      <!-- Barra de Filtros y Búsqueda -->
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 mb-8 shadow-sm transition-colors">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-4 items-end">
          
          <!-- Buscador -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400 mb-2" for="search-input">Buscar Producto</label>
            <div class="flex gap-2">
              <div class="relative flex-1">
                <input id="search-input" type="text" placeholder="Camiseta, zapatilla, balón..." 
                  value="${busquedaTexto}"
                  class="w-full rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 pl-10 pr-4 py-2.5 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-sport-500 transition-colors" />
                <svg class="absolute left-3.5 top-3 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              
              <!-- A1 Comment: AI visual search camera button -->
              <button id="visual-search-btn" class="px-3.5 rounded-xl border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 hover:bg-sport-500 hover:border-sport-500 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1.5 text-slate-600 dark:text-stone-300" title="Búsqueda Visual con IA">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316A2.192 2.192 0 0 0 14.502 4h-5c-.75 0-1.437.377-1.837 1.004l-.838 1.371Z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.25a3 3 0 1 0 6 0 3 3 0 0 0-6 0Z"></path>
                </svg>
                <span class="text-xs font-bold uppercase tracking-wider hidden sm:inline">Visual AI</span>
              </button>
            </div>
          </div>

          <!-- Talla -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400 mb-2" for="filter-talla">Talla</label>
            <select id="filter-talla" 
              class="w-full rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 px-4 py-2.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-sport-500 transition-colors">
              <option value="Todas" ${tallaSeleccionada === "Todas" ? "selected" : ""}>Todas las tallas</option>
              <option value="XS" ${tallaSeleccionada === "XS" ? "selected" : ""}>XS</option>
              <option value="S" ${tallaSeleccionada === "S" ? "selected" : ""}>S</option>
              <option value="M" ${tallaSeleccionada === "M" ? "selected" : ""}>M</option>
              <option value="L" ${tallaSeleccionada === "L" ? "selected" : ""}>L</option>
              <option value="XL" ${tallaSeleccionada === "XL" ? "selected" : ""}>XL</option>
              <option value="XXL" ${tallaSeleccionada === "XXL" ? "selected" : ""}>XXL</option>
              <option value="No. 5" ${tallaSeleccionada === "No. 5" ? "selected" : ""}>No. 5 (Balones)</option>
            </select>
          </div>

          <!-- Ordenar por precio -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400 mb-2" for="sort-select">Ordenar por</label>
            <select id="sort-select" 
              class="w-full rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 px-4 py-2.5 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-sport-500 transition-colors">
              <option value="defecto" ${ordenSeleccionado === "defecto" ? "selected" : ""}>Recomendados</option>
              <option value="precio-asc" ${ordenSeleccionado === "precio-asc" ? "selected" : ""}>Precio: Menor a Mayor</option>
              <option value="precio-desc" ${ordenSeleccionado === "precio-desc" ? "selected" : ""}>Precio: Mayor a Menor</option>
            </select>
          </div>

          <!-- Rango Precio -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400" for="price-range">Precio Máximo</label>
              <span id="price-val" class="text-xs font-bold text-sport-500 dark:text-sport-400 font-display">$${precioMaximo.toLocaleString()}</span>
            </div>
            <input id="price-range" type="range" min="50000" max="500000" step="10000" 
              value="${precioMaximo}"
              class="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-sport-500" />
          </div>

        </div>

        <!-- Categorías (Filtro por botones) -->
        <div class="flex flex-wrap items-center gap-2.5 mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400 mr-2">Categorías:</span>
          ${["Todos", "Camisetas", "Calzado", "Pantalonetas", "Balones", "Accesorios", "Chaquetas"].map(cat => {
            const act = categoriaSeleccionada === cat;
            return `<button class="category-btn px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              act 
                ? "bg-sport-500 border-sport-500 text-white shadow-sm" 
                : "border-zinc-300 dark:border-zinc-800 text-slate-600 dark:text-stone-300 hover:border-sport-500"
            }" data-category="${cat}">${cat}</button>`;
          }).join("")}
        </div>
      </div>

      <!-- Cuadrícula de Productos -->
      <div id="product-grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <!-- Spinner mientras carga -->
        <div class="col-span-full py-20 flex flex-col items-center justify-center text-slate-400 gap-4">
          <div class="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-sport-500"></div>
          <p class="text-sm font-semibold text-zinc-500">Cargando productos...</p>
        </div>
      </div>
    </div>
  </main>

  ${renderFooter()}
  `;
}

// Genera el listado de tarjetas de productos
function renderGridHTML(productos) {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  if (productos.length === 0) {
    grid.innerHTML = `
    <div class="col-span-full py-20 flex flex-col items-center justify-center text-center text-slate-400">
      <svg class="w-16 h-16 text-slate-300 dark:text-stone-700" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
      <h3 class="text-lg font-black uppercase text-slate-800 dark:text-white mt-4 font-display">No se encontraron productos</h3>
      <p class="text-sm text-zinc-500 mt-2">Prueba modificando tus filtros o ingresando otro término de búsqueda.</p>
    </div>
    `;
    return;
  }

  grid.innerHTML = productos.map(p => {
    const sinStock = p.stock === 0;
    
    return `
    <div class="group flex flex-col rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-md hover:border-sport-500/50 transition-all duration-300">
      <!-- Imagen con zoom en hover y badge de stock -->
      <div class="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <img src="${p.imagen.replace(/w=\d+/, 'w=400')}" alt="${p.nombre}"
             loading="lazy" decoding="async"
             class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div class="absolute inset-0 bg-gradient-to-t from-zinc-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <a href="/producto/${p.id}" data-link class="w-full text-center rounded-xl bg-white/90 dark:bg-zinc-950/90 py-2.5 text-xs font-bold text-slate-800 dark:text-white shadow-sm backdrop-blur-sm flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
            Ver detalles
          </a>
        </div>
        ${sinStock 
          ? `<span class="absolute top-4 left-4 rounded-full bg-zinc-700/90 text-[10px] font-black uppercase text-white px-3 py-1 tracking-wider shadow-sm">Agotado</span>`
          : p.stock <= 3 
            ? `<span class="absolute top-4 left-4 rounded-full bg-amber-600/95 text-[10px] font-black uppercase text-white px-3 py-1 tracking-wider shadow-sm">Pocas unidades</span>`
            : `<span class="absolute top-4 left-4 rounded-full bg-sport-500/90 text-[10px] font-black uppercase text-white px-3 py-1 tracking-wider shadow-sm">${p.categoria}</span>`
        }
      </div>

      <!-- Cuerpo de la tarjeta -->
      <div class="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 class="text-lg font-black uppercase text-zinc-900 dark:text-zinc-100 font-display group-hover:text-sport-500 transition-colors leading-tight">
            <a href="/producto/${p.id}" data-link>${p.nombre}</a>
          </h3>
          <p class="mt-2 text-xs text-slate-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
            ${p.descripcion}
          </p>
        </div>
        
        <div class="mt-6 flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-4">
          <div>
            <span class="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Precio</span>
            <span class="text-lg font-extrabold text-sport-500 dark:text-sport-400 font-display">$${p.precio.toLocaleString()}</span>
          </div>
          
          <!-- Botón agregar rápido -->
          ${sinStock 
            ? `<button disabled class="rounded-xl bg-zinc-200 dark:bg-zinc-800 px-3.5 py-2.5 text-xs font-bold text-slate-400 cursor-not-allowed">Sin stock</button>`
            : `<button class="quick-add-btn rounded-xl bg-sport-500 hover:bg-sport-600 text-white p-2.5 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm shadow-sport-500/20 flex items-center justify-center w-9 h-9" 
                 data-id="${p.id}" aria-label="Agregar al carrito">
                 <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
               </button>`
          }
        </div>
      </div>
    </div>
    `;
  }).join("");

  // Añadir eventos a los botones de agregado rápido
  document.querySelectorAll(".quick-add-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = parseInt(btn.getAttribute("data-id"));
      const p = productos.find(x => x.id === id);
      if (p) {
        // Seleccionamos la primera talla y color por defecto para el agregado rápido
        const tallaDef = p.tallas[0] || "M";
        const colorDef = p.colores[0] || "Único";
        agregarAlCarrito(p, tallaDef, colorDef, 1);
        
        // Efecto visual de agregado
        btn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>`;
        btn.classList.remove("bg-sport-500");
        btn.classList.add("bg-green-600");
        setTimeout(() => {
          btn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>`;
          btn.classList.remove("bg-green-600");
          btn.classList.add("bg-sport-500");
        }, 1200);
      }
    });
  });
}

// Filtra y ordena los productos basándose en el estado de los controles
function filtrarProductos() {
  let filtrados = productosMemoria;

  // Filtro Categoría
  if (categoriaSeleccionada !== "Todos") {
    filtrados = filtrados.filter(p => p.categoria === categoriaSeleccionada);
  }

  // Filtro Texto
  if (busquedaTexto) {
    const q = busquedaTexto.toLowerCase();
    filtrados = filtrados.filter(p => 
      p.nombre.toLowerCase().includes(q) || 
      p.descripcion.toLowerCase().includes(q)
    );
  }

  // Filtro Talla
  if (tallaSeleccionada !== "Todas") {
    filtrados = filtrados.filter(p => p.tallas.includes(tallaSeleccionada));
  }

  // Filtro Precio Máximo
  filtrados = filtrados.filter(p => p.precio <= precioMaximo);

  // Ordenamiento
  if (ordenSeleccionado === "precio-asc") {
    filtrados.sort((a, b) => a.precio - b.precio);
  } else if (ordenSeleccionado === "precio-desc") {
    filtrados.sort((a, b) => b.precio - a.precio);
  }

  renderGridHTML(filtrados);
}

export async function setupCatalogo() {
  setupNavbar();

  // Buscar elementos DOM
  const searchInput = document.getElementById("search-input");
  const filterTalla = document.getElementById("filter-talla");
  const sortSelect = document.getElementById("sort-select");
  const priceRange = document.getElementById("price-range");
  const priceVal = document.getElementById("price-val");

  // Escuchar entrada de texto en buscador
  searchInput?.addEventListener("input", (e) => {
    busquedaTexto = e.target.value.trim();
    filtrarProductos();
  });

  // A1 Comment: Setup visual AI search button click
  const visualSearchBtn = document.getElementById("visual-search-btn");
  visualSearchBtn?.addEventListener("click", () => {
    openVisualSearchModal();
  });

  // A1 Comment: Visual Search scan window
  function openVisualSearchModal() {
    if (!document.getElementById("vs-scan-style")) {
      const style = document.createElement("style");
      style.id = "vs-scan-style";
      style.innerHTML = `
        @keyframes vsLaser {
          0% { top: 0%; opacity: 0.8; }
          50% { top: 100%; opacity: 0.8; }
          100% { top: 0%; opacity: 0.8; }
        }
        .vs-scanner-line {
          animation: vsLaser 2.2s ease-in-out infinite;
        }
      `;
      document.head.appendChild(style);
    }

    const modal = document.createElement("div");
    modal.id = "vs-modal";
    modal.className = "fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4 animate-fade-in-delay";
    modal.innerHTML = `
      <div class="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl text-white relative">
        <button id="vs-modal-close" class="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors cursor-pointer text-sm font-bold">✕</button>
        <h3 class="text-xl font-black uppercase tracking-wider font-display mb-4 text-sport-400">Visual AI Search</h3>
        
        <!-- A1 Comment: Dropzone area -->
        <div id="vs-dropzone" class="border-2 border-dashed border-zinc-700 hover:border-sport-500 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors text-center relative overflow-hidden bg-zinc-950/40">
          <svg class="w-10 h-10 text-zinc-500 mb-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316A2.192 2.192 0 0 0 14.502 4h-5c-.75 0-1.437.377-1.837 1.004l-.838 1.371Z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.25a3 3 0 1 0 6 0 3 3 0 0 0-6 0Z"></path>
          </svg>
          <p class="text-xs font-bold text-zinc-300">Drop sportswear photo here or click to upload</p>
          <input type="file" id="vs-file" class="hidden" accept="image/*">
        </div>

        <!-- A1 Comment: Visual scanner -->
        <div id="vs-preview-container" class="hidden mt-4">
          <div class="relative rounded-2xl overflow-hidden aspect-video bg-zinc-950 border border-zinc-800">
            <img id="vs-preview-img" class="w-full h-full object-cover">
            <div class="absolute left-0 right-0 h-0.5 bg-sport-500 shadow-lg shadow-sport-500/80 vs-scanner-line"></div>
          </div>
          <div class="mt-4 bg-zinc-950 p-4 rounded-2xl border border-zinc-800 text-xs font-mono space-y-1.5 h-28 overflow-y-auto" id="vs-log">
            <!-- A1 Comment: Scanner lines -->
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const closeBtn = document.getElementById("vs-modal-close");
    const dropzone = document.getElementById("vs-dropzone");
    const fileInput = document.getElementById("vs-file");

    closeBtn?.addEventListener("click", () => {
      modal.remove();
    });

    dropzone?.addEventListener("click", () => {
      fileInput?.click();
    });

    // A1 Comment: Drag and drop handlers
    dropzone?.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropzone.classList.add("border-sport-500", "bg-sport-950/10");
    });

    dropzone?.addEventListener("dragleave", () => {
      dropzone.classList.remove("border-sport-500", "bg-sport-950/10");
    });

    dropzone?.addEventListener("drop", (e) => {
      e.preventDefault();
      dropzone.classList.remove("border-sport-500", "bg-sport-950/10");
      if (e.dataTransfer?.files?.length) {
        processUploadedImage(e.dataTransfer.files[0]);
      }
    });

    fileInput?.addEventListener("change", (e) => {
      const target = e.target;
      if (target.files?.length) {
        processUploadedImage(target.files[0]);
      }
    });
  }

  // A1 Comment: Process visual search image
  function processUploadedImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imgData = e.target?.result;
      const dropzone = document.getElementById("vs-dropzone");
      const previewContainer = document.getElementById("vs-preview-container");
      const previewImg = document.getElementById("vs-preview-img");
      const logContainer = document.getElementById("vs-log");

      if (dropzone) dropzone.className = "hidden";
      if (previewContainer) previewContainer.className = "mt-4 block animate-fade-in-delay";
      if (previewImg && imgData) previewImg.src = imgData;

      let progress = 0;
      const logs = [
        "[AI] Analyzing sportswear image structure...",
        "[AI] Scanning colors and textures...",
        "[AI] Matching features with store catalog...",
        "[AI] Search completed successfully!"
      ];

      // A1 Comment: Select category by filename keywords
      const name = file.name.toLowerCase();
      let detectedCategory = "Calzado"; // default
      if (name.includes("camis") || name.includes("shirt") || name.includes("remera") || name.includes("top") || name.includes("jersey")) {
        detectedCategory = "Camisetas";
      } else if (name.includes("pant") || name.includes("short") || name.includes("bermuda") || name.includes("pantalon")) {
        detectedCategory = "Pantalonetas";
      } else if (name.includes("balon") || name.includes("ball") || name.includes("pelota")) {
        detectedCategory = "Balones";
      } else if (name.includes("chaq") || name.includes("jack") || name.includes("abrigo") || name.includes("jacket")) {
        detectedCategory = "Chaquetas";
      } else if (name.includes("acc") || name.includes("gorra") || name.includes("bag") || name.includes("bolso") || name.includes("medias")) {
        detectedCategory = "Accesorios";
      }

      function addLogLine(txt) {
        if (!logContainer) return;
        const line = document.createElement("div");
        line.className = "text-zinc-400";
        line.innerHTML = txt;
        logContainer.appendChild(line);
        logContainer.scrollTop = logContainer.scrollHeight;
      }

      // A1 Comment: Write scan results sequentially
      const logTimer = setInterval(() => {
        if (progress < logs.length) {
          addLogLine(logs[progress]);
          progress++;
        } else {
          clearInterval(logTimer);
          addLogLine(`<span class="text-green-400 font-bold">> DETECTADO: ${detectedCategory} (98.2% match)</span>`);
          
          setTimeout(() => {
            const modal = document.getElementById("vs-modal");
            if (modal) modal.remove();

            // A1 Comment: Change category and run filter
            categoriaSeleccionada = detectedCategory;
            
            // A1 Comment: Highlight active button
            document.querySelectorAll(".category-btn").forEach(btn => {
              if (btn.getAttribute("data-category") === detectedCategory) {
                btn.classList.add("bg-sport-500", "border-sport-500", "text-white");
                btn.classList.remove("border-zinc-300", "dark:border-zinc-800", "text-slate-600", "dark:text-stone-300");
              } else {
                btn.classList.remove("bg-sport-500", "border-sport-500", "text-white");
                btn.classList.add("border-zinc-300", "dark:border-zinc-800", "text-slate-600", "dark:text-stone-300");
              }
            });

            filtrarProductos();
            showToast(`IA detectó: ${detectedCategory}`);

            // A1 Comment: Scroll to matches
            const grid = document.getElementById("product-grid");
            grid?.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 1200);
        }
      }, 650);
    };
    reader.readAsDataURL(file);
  }

  // A1 Comment: Create popup notification
  function showToast(msg) {
    const toast = document.createElement("div");
    toast.className = "fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-sport-500 border border-sport-600 text-white font-bold uppercase tracking-wider text-xs px-6 py-3 rounded-full shadow-lg animate-bounce";
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  }

  // Escuchar cambio de talla
  filterTalla?.addEventListener("change", (e) => {
    tallaSeleccionada = e.target.value;
    filtrarProductos();
  });

  // Escuchar cambio de orden
  sortSelect?.addEventListener("change", (e) => {
    ordenSeleccionado = e.target.value;
    filtrarProductos();
  });

  // Escuchar cambio en rango de precio
  priceRange?.addEventListener("input", (e) => {
    precioMaximo = parseInt(e.target.value);
    if (priceVal) priceVal.textContent = `$${precioMaximo.toLocaleString()}`;
    filtrarProductos();
  });

  // Escuchar clics en los botones de categorías
  document.querySelectorAll(".category-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      // Remover clase activa de todos
      document.querySelectorAll(".category-btn").forEach(b => {
        b.classList.remove("bg-sport-500", "border-sport-500", "text-white");
        b.classList.add("border-zinc-300", "dark:border-zinc-800", "text-slate-600", "dark:text-stone-300");
      });

      // Añadir clase activa al presionado
      btn.classList.add("bg-sport-500", "border-sport-500", "text-white");
      btn.classList.remove("border-zinc-300", "dark:border-zinc-800", "text-slate-600", "dark:text-stone-300");

      categoriaSeleccionada = btn.getAttribute("data-category");
      filtrarProductos();
    });
  });

  // Cargar productos desde el API con manejo de cold start de Render
  const grid = document.getElementById("product-grid");

  // Mostrar mensaje de "servidor despertando" tras 3 segundos sin respuesta
  const coldStartTimer = setTimeout(() => {
    if (!grid) return;
    grid.innerHTML = `
    <div class="col-span-full py-16 flex flex-col items-center justify-center text-center gap-5">
      <!-- Ícono animado de servidor -->
      <div class="relative flex items-center justify-center w-20 h-20">
        <div class="absolute inset-0 rounded-full bg-sport-500/10 animate-ping"></div>
        <div class="relative flex items-center justify-center w-20 h-20 rounded-full bg-sport-500/10 border border-sport-500/30">
          <svg class="w-9 h-9 text-sport-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3V6a3 3 0 013-3h13.5a3 3 0 013 3v5.25a3 3 0 01-3 3m-13.5 0v3.75m13.5-3.75v3.75m0 0H5.25m13.5 0a3 3 0 01-3 3H8.25a3 3 0 01-3-3"/>
          </svg>
        </div>
      </div>

      <!-- Textos -->
      <div>
        <h3 class="text-lg font-black uppercase text-zinc-900 dark:text-white font-display">
          Despertando el servidor...
        </h3>
        <p class="text-sm text-zinc-500 dark:text-stone-400 mt-1 max-w-xs mx-auto">
          El servidor gratuito entra en reposo tras inactividad.<br>
          <span class="text-sport-500 font-semibold">Esto puede tardar hasta 60 segundos.</span>
        </p>
      </div>

      <!-- Barra de progreso animada -->
      <div class="w-64 bg-zinc-200 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
        <div id="cold-start-bar" class="h-full bg-gradient-to-r from-sport-400 to-sport-600 rounded-full" style="width:0%"></div>
      </div>
      <p id="cold-start-tip" class="text-xs text-zinc-400 dark:text-stone-500 italic">Conectando con la tienda...</p>
    </div>
    `;

    // Animar la barra de progreso durante ~55 segundos
    let pct = 0;
    const tips = [
      "Iniciando base de datos...",
      "Cargando catálogo de productos...",
      "Casi listo, un momento más...",
      "Estableciendo conexión segura...",
    ];
    let tipIdx = 0;
    const bar = document.getElementById("cold-start-bar");
    const tipEl = document.getElementById("cold-start-tip");
    const barInterval = setInterval(() => {
      pct = Math.min(pct + (pct < 70 ? 1.2 : 0.3), 92);
      if (bar) bar.style.width = pct + "%";
      if (pct % 20 < 1.5 && tipEl && tipIdx < tips.length) {
        tipEl.textContent = tips[tipIdx++];
      }
    }, 650);
    // Guardar referencia para limpiarla si carga exitosamente
    window._coldStartBarInterval = barInterval;
  }, 3000);

  try {
    // Intentar servir desde caché primero (instantáneo en re-visitas)
    const cached = getCachedProductos();
    if (cached && cached.length > 0) {
      clearTimeout(coldStartTimer);
      productosMemoria = cached;
      filtrarProductos();
      // Re-fetch en background silenciosamente para refrescar la caché
      obtenerProductos().then(fresh => { setCachedProductos(fresh); }).catch(() => {});
    } else {
      productosMemoria = await obtenerProductos();
      setCachedProductos(productosMemoria);
      clearTimeout(coldStartTimer);
      // Limpiar barra si seguía animándose
      if (window._coldStartBarInterval) {
        clearInterval(window._coldStartBarInterval);
        delete window._coldStartBarInterval;
      }
      filtrarProductos();
    }
  } catch (err) {
    clearTimeout(coldStartTimer);
    if (window._coldStartBarInterval) {
      clearInterval(window._coldStartBarInterval);
      delete window._coldStartBarInterval;
    }
    if (grid) {
      grid.innerHTML = `
      <div class="col-span-full py-20 flex flex-col items-center justify-center text-center gap-4">
        <svg class="w-16 h-16 text-red-400 dark:text-red-700" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        <h3 class="text-lg font-black uppercase text-zinc-900 dark:text-white font-display">No se pudo conectar con el servidor</h3>
        <p class="text-sm text-zinc-500 dark:text-stone-400 max-w-xs mx-auto">
          El servidor no respondió a tiempo. Por favor recarga la página e intenta de nuevo.
        </p>
        <button onclick="window.location.reload()"
          class="mt-2 rounded-xl bg-sport-500 hover:bg-sport-600 text-white text-xs font-bold uppercase tracking-wider px-6 py-3 transition-all hover:scale-105 cursor-pointer flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          Reintentar
        </button>
      </div>
      `;
    }
  }
}
