import { obtenerProductos } from "../../services/product.service.js";
import { renderNavbar, setupNavbar } from "../../components/navbar.js";
import { renderFooter } from "../../components/footer.js";
import { agregarAlCarrito } from "../../utils/cart.js";

// Variable local de la vista para mantener el estado de los productos cargados
let productosMemoria = [];
let categoriaSeleccionada = "Todos";
let precioMaximo = 500000;
let tallaSeleccionada = "Todas";
let ordenSeleccionado = "defecto";
let busquedaTexto = "";

export function renderCatalogo() {
  // Capturar parámetros opcionales de la URL (?categoria=Vestidos)
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get("categoria");
  if (catParam) {
    categoriaSeleccionada = catParam;
    // Limpiamos los parámetros de la URL de forma sutil
    window.history.replaceState({}, "", "/productos");
  }

  return `
  ${renderNavbar()}

  <main class="min-h-screen bg-stone-50 dark:bg-stone-950 transition-colors py-12">
    <div class="mx-auto max-w-7xl px-6">
      <!-- Cabecera de Colección -->
      <div class="mb-12 text-center md:text-left">
        <span class="text-xs font-bold uppercase tracking-widest text-rosegold-500">Bodega & Atelier</span>
        <h1 class="text-4xl font-bold text-burgundy-850 dark:text-rosegold-400 font-serif mt-2">Colección de Confecciones</h1>
        <p class="text-slate-500 dark:text-stone-400 mt-2 text-sm max-w-xl">Prendas sofisticadas hechas a mano por modistas profesionales. Filtra e inicia tu orden.</p>
      </div>

      <!-- Barra de Filtros y Búsqueda -->
      <div class="bg-cream-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-850 rounded-3xl p-6 mb-8 shadow-sm transition-colors">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-4 items-end">
          
          <!-- Buscador -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400 mb-2" for="search-input">Buscar Prenda</label>
            <div class="relative">
              <input id="search-input" type="text" placeholder="Vestido, traje, abrigo..." 
                value="${busquedaTexto}"
                class="w-full rounded-xl bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 pl-10 pr-4 py-2.5 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-rosegold-500 transition-colors" />
              <span class="absolute left-3.5 top-3 text-slate-400 text-sm">🔍</span>
            </div>
          </div>

          <!-- Talla -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400 mb-2" for="filter-talla">Talla</label>
            <select id="filter-talla" 
              class="w-full rounded-xl bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 px-4 py-2.5 text-sm text-slate-850 dark:text-white focus:outline-none focus:border-rosegold-500 transition-colors">
              <option value="Todas" ${tallaSeleccionada === "Todas" ? "selected" : ""}>Todas las tallas</option>
              <option value="XS" ${tallaSeleccionada === "XS" ? "selected" : ""}>XS</option>
              <option value="S" ${tallaSeleccionada === "S" ? "selected" : ""}>S</option>
              <option value="M" ${tallaSeleccionada === "M" ? "selected" : ""}>M</option>
              <option value="L" ${tallaSeleccionada === "L" ? "selected" : ""}>L</option>
              <option value="XL" ${tallaSeleccionada === "XL" ? "selected" : ""}>XL</option>
            </select>
          </div>

          <!-- Ordenar por precio -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400 mb-2" for="sort-select">Ordenar por</label>
            <select id="sort-select" 
              class="w-full rounded-xl bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 px-4 py-2.5 text-sm text-slate-850 dark:text-white focus:outline-none focus:border-rosegold-500 transition-colors">
              <option value="defecto" ${ordenSeleccionado === "defecto" ? "selected" : ""}>Recomendados</option>
              <option value="precio-asc" ${ordenSeleccionado === "precio-asc" ? "selected" : ""}>Precio: Menor a Mayor</option>
              <option value="precio-desc" ${ordenSeleccionado === "precio-desc" ? "selected" : ""}>Precio: Mayor a Menor</option>
            </select>
          </div>

          <!-- Rango Precio -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400" for="price-range">Precio Máximo</label>
              <span id="price-val" class="text-xs font-bold text-burgundy-800 dark:text-rosegold-400 font-serif">$${precioMaximo.toLocaleString()}</span>
            </div>
            <input id="price-range" type="range" min="100000" max="500000" step="10000" 
              value="${precioMaximo}"
              class="w-full h-1.5 bg-stone-200 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer accent-rosegold-500" />
          </div>

        </div>

        <!-- Categorías (Filtro por botones) -->
        <div class="flex flex-wrap items-center gap-2.5 mt-6 pt-6 border-t border-stone-200 dark:border-stone-800">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400 mr-2">Categorías:</span>
          ${["Todos", "Vestidos", "Trajes", "Blusas", "Faldas", "Sacos", "Accesorios"].map(cat => {
            const act = categoriaSeleccionada === cat;
            return `<button class="category-btn px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              act 
                ? "bg-burgundy-800 border-burgundy-800 text-white shadow-sm" 
                : "border-stone-300 dark:border-stone-800 text-slate-600 dark:text-stone-300 hover:border-rosegold-500"
            }" data-category="${cat}">${cat}</button>`;
          }).join("")}
        </div>
      </div>

      <!-- Cuadrícula de Productos -->
      <div id="product-grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <!-- Spinner mientras carga -->
        <div class="col-span-full py-20 flex flex-col items-center justify-center text-slate-400 gap-4">
          <div class="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-burgundy-850"></div>
          <p class="text-sm font-semibold text-stone-500">Hilando catálogo...</p>
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
    <div class="col-span-full py-20 text-center text-slate-400">
      <span class="text-5xl">🧵</span>
      <h3 class="text-lg font-bold text-slate-800 dark:text-white mt-4 font-serif">No se encontraron prendas</h3>
      <p class="text-sm text-stone-500 mt-2">Prueba modificando tus filtros o ingresando otro término de búsqueda.</p>
    </div>
    `;
    return;
  }

  grid.innerHTML = productos.map(p => {
    const sinStock = p.stock === 0;
    
    return `
    <div class="group flex flex-col rounded-3xl bg-cream-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-850 overflow-hidden shadow-sm hover:shadow-md hover:border-rosegold-500/50 transition-all duration-300">
      <!-- Imagen con zoom en hover y badge de stock -->
      <div class="relative aspect-square overflow-hidden bg-stone-100">
        <img src="${p.imagen}" alt="${p.nombre}" 
             class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div class="absolute inset-0 bg-gradient-to-t from-stone-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <a href="/producto/${p.id}" data-link class="w-full text-center rounded-xl bg-white/90 dark:bg-stone-950/90 py-2.5 text-xs font-bold text-slate-800 dark:text-white shadow-sm backdrop-blur-sm">
            🔎 Ver detalles
          </a>
        </div>
        ${sinStock 
          ? `<span class="absolute top-4 left-4 rounded-full bg-stone-700/90 text-[10px] font-black uppercase text-white px-3 py-1 tracking-wider shadow-sm">Agotado</span>`
          : p.stock <= 3 
            ? `<span class="absolute top-4 left-4 rounded-full bg-amber-600/95 text-[10px] font-black uppercase text-white px-3 py-1 tracking-wider shadow-sm">Pocas unidades</span>`
            : `<span class="absolute top-4 left-4 rounded-full bg-burgundy-800/90 text-[10px] font-black uppercase text-white px-3 py-1 tracking-wider shadow-sm">${p.categoria}</span>`
        }
      </div>

      <!-- Cuerpo de la tarjeta -->
      <div class="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-stone-100 font-serif group-hover:text-rosegold-500 transition-colors">
            <a href="/producto/${p.id}" data-link>${p.nombre}</a>
          </h3>
          <p class="mt-2 text-xs text-slate-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
            ${p.descripcion}
          </p>
        </div>
        
        <div class="mt-6 flex items-center justify-between border-t border-stone-200 dark:border-stone-850 pt-4">
          <div>
            <span class="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Precio</span>
            <span class="text-lg font-extrabold text-burgundy-850 dark:text-rosegold-400 font-serif">$${p.precio.toLocaleString()}</span>
          </div>
          
          <!-- Botón agregar rápido -->
          ${sinStock 
            ? `<button disabled class="rounded-xl bg-stone-300 dark:bg-stone-800 px-3.5 py-2.5 text-xs font-bold text-slate-400 cursor-not-allowed">Sin stock</button>`
            : `<button class="quick-add-btn rounded-xl bg-rosegold-500 hover:bg-rosegold-700 text-white p-2.5 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm shadow-rosegold-500/10" 
                 data-id="${p.id}" aria-label="Agregar al carrito">🛒 +</button>`
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
        const originalText = btn.textContent;
        btn.textContent = "✓";
        btn.classList.remove("bg-rosegold-500");
        btn.classList.add("bg-green-600");
        setTimeout(() => {
          btn.textContent = "🛒 +";
          btn.classList.remove("bg-green-600");
          btn.classList.add("bg-rosegold-500");
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
        b.classList.remove("bg-burgundy-800", "border-burgundy-800", "text-white");
        b.classList.add("border-stone-300", "dark:border-stone-800", "text-slate-600", "dark:text-stone-300");
      });

      // Añadir clase activa al presionado
      btn.classList.add("bg-burgundy-800", "border-burgundy-800", "text-white");
      btn.classList.remove("border-stone-300", "dark:border-stone-800", "text-slate-600", "dark:text-stone-300");

      categoriaSeleccionada = btn.getAttribute("data-category");
      filtrarProductos();
    });
  });

  // Cargar productos desde el API
  try {
    productosMemoria = await obtenerProductos();
    filtrarProductos();
  } catch (err) {
    const grid = document.getElementById("product-grid");
    if (grid) {
      grid.innerHTML = `
      <div class="col-span-full py-20 text-center text-red-500">
        <span class="text-5xl">⚠️</span>
        <h3 class="text-lg font-bold mt-4 font-serif">Error al conectar con la tienda</h3>
        <p class="text-sm text-stone-500 mt-2">Por favor, valida que el servidor API se encuentre en ejecución.</p>
      </div>
      `;
    }
  }
}
