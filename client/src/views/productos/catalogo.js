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
  // Capturar parámetros opcionales de la URL (?categoria=Camisetas)
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get("categoria");
  if (catParam) {
    categoriaSeleccionada = catParam;
    // Limpiamos los parámetros de la URL de forma sutil
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
            <div class="relative">
              <input id="search-input" type="text" placeholder="Camiseta, zapatilla, balón..." 
                value="${busquedaTexto}"
                class="w-full rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 pl-10 pr-4 py-2.5 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-sport-500 transition-colors" />
              <svg class="absolute left-3.5 top-3 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
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
        <img src="${p.imagen}" alt="${p.nombre}" 
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

  // Cargar productos desde el API
  try {
    productosMemoria = await obtenerProductos();
    filtrarProductos();
  } catch (err) {
    const grid = document.getElementById("product-grid");
    if (grid) {
      grid.innerHTML = `
      <div class="col-span-full py-20 flex flex-col items-center justify-center text-center text-red-500">
        <svg class="w-16 h-16 text-red-400 dark:text-red-800" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        <h3 class="text-lg font-black uppercase mt-4 font-display">Error al conectar con la tienda</h3>
        <p class="text-sm text-zinc-500 mt-2">Por favor, valida que el servidor API se encuentre en ejecución.</p>
      </div>
      `;
    }
  }
}
