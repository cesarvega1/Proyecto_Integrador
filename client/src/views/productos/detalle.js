import { obtenerProductoPorId } from "../../services/product.service.js";
import { renderNavbar, setupNavbar } from "../../components/navbar.js";
import { renderFooter } from "../../components/footer.js";
import { agregarAlCarrito } from "../../utils/cart.js";
import { navigate } from "../../router/router.js";

export function renderDetalle(params) {
  return `
  ${renderNavbar()}

  <main class="min-h-screen bg-stone-50 dark:bg-stone-950 transition-colors py-12">
    <div class="mx-auto max-w-5xl px-6">
      
      <!-- Botón de regreso -->
      <div class="mb-8">
        <a href="/productos" data-link class="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-stone-400 hover:text-rosegold-500 transition-colors">
          ⬅ Volver a la colección
        </a>
      </div>

      <!-- Contenedor del Detalle -->
      <div id="product-detail-container">
        <!-- Spinner mientras carga -->
        <div class="py-24 flex flex-col items-center justify-center text-slate-400 gap-4">
          <div class="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-burgundy-850"></div>
          <p class="text-sm font-semibold text-stone-500">Examinando costuras...</p>
        </div>
      </div>

    </div>
  </main>

  ${renderFooter()}
  `;
}

export async function setupDetalle(params) {
  setupNavbar();
  const id = params.id;
  const container = document.getElementById("product-detail-container");
  if (!container) return;

  try {
    const producto = await obtenerProductoPorId(id);
    
    // Estado de selección temporal
    let tallaSeleccionada = producto.tallas[0] || "M";
    let colorSeleccionado = producto.colores[0] || "Único";
    let cantidadSeleccionada = 1;

    function renderizarDetalleHTML() {
      const sinStock = producto.stock === 0;

      container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 bg-cream-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-850 rounded-3xl p-8 shadow-sm">
        
        <!-- Columna 1: Imagen -->
        <div class="relative overflow-hidden rounded-2xl aspect-square bg-stone-150 border border-stone-200 dark:border-stone-800">
          <img src="${producto.imagen}" alt="${producto.nombre}" class="w-full h-full object-cover" />
          ${producto.stock <= 3 && producto.stock > 0 
            ? `<span class="absolute top-4 left-4 rounded-full bg-amber-600 px-3.5 py-1 text-[10px] font-black uppercase text-white tracking-wider">¡Pocas unidades!</span>`
            : sinStock 
              ? `<span class="absolute top-4 left-4 rounded-full bg-stone-750 px-3.5 py-1 text-[10px] font-black uppercase text-white tracking-wider">Agotado</span>`
              : ""
          }
        </div>

        <!-- Columna 2: Ficha Técnica -->
        <div class="flex flex-col justify-between">
          <div>
            <span class="text-xs font-bold uppercase tracking-widest text-rosegold-500">${producto.categoria}</span>
            <h1 class="text-3xl sm:text-4xl font-bold text-burgundy-850 dark:text-stone-100 font-serif mt-2">${producto.nombre}</h1>
            
            <div class="mt-4 flex items-baseline gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
              <span class="text-3xl font-extrabold text-burgundy-850 dark:text-rosegold-400 font-serif">$${producto.precio.toLocaleString()}</span>
              <span class="text-xs text-slate-400 font-sans">IVA incluido / Envíos nacionales</span>
            </div>

            <p class="mt-6 text-sm text-slate-600 dark:text-stone-300 leading-relaxed font-sans text-justify">
              ${producto.descripcion}
            </p>

            <!-- Selector de Tallas -->
            <div class="mt-6">
              <span class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400 mb-3">Talla:</span>
              <div class="flex flex-wrap gap-2">
                ${producto.tallas.map(talla => {
                  const act = tallaSeleccionada === talla;
                  return `<button class="talla-btn w-12 h-12 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    act 
                      ? "bg-burgundy-850 border-burgundy-850 text-white shadow-sm" 
                      : "border-stone-300 dark:border-stone-850 text-slate-700 dark:text-stone-300 hover:border-rosegold-500"
                  }" data-talla="${talla}">${talla}</button>`;
                }).join("")}
              </div>
            </div>

            <!-- Selector de Colores -->
            <div class="mt-6">
              <span class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400 mb-3">Color:</span>
              <div class="flex flex-wrap gap-3">
                ${producto.colores.map(color => {
                  const act = colorSeleccionado === color;
                  return `
                  <button class="color-btn flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    act 
                      ? "bg-rosegold-100 border-rosegold-500 text-rosegold-700 dark:bg-rosegold-950/20 dark:text-rosegold-300" 
                      : "border-stone-300 dark:border-stone-850 text-slate-700 dark:text-stone-300 hover:border-rosegold-500"
                  }" data-color="${color}">
                    <span class="h-2.5 w-2.5 rounded-full bg-rosegold-400 inline-block" style="background-color: ${getColorHex(color)}"></span>
                    ${color}
                  </button>`;
                }).join("")}
              </div>
            </div>

            <!-- Selector de Cantidad -->
            ${!sinStock ? `
            <div class="mt-6">
              <span class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400 mb-3">Cantidad:</span>
              <div class="flex items-center gap-3">
                <button id="qty-dec" class="w-10 h-10 rounded-lg border border-stone-300 dark:border-stone-850 text-sm font-bold hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer">-</button>
                <span id="qty-val" class="w-12 text-center text-sm font-bold text-slate-800 dark:text-white">${cantidadSeleccionada}</span>
                <button id="qty-inc" class="w-10 h-10 rounded-lg border border-stone-300 dark:border-stone-850 text-sm font-bold hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer">+</button>
                <span class="text-xs text-slate-400 dark:text-stone-500">(${producto.stock} disponibles en stock)</span>
              </div>
            </div>
            ` : ""}

          </div>

          <!-- Acciones de Compra -->
          <div class="mt-10 pt-6 border-t border-stone-200 dark:border-stone-800">
            ${sinStock 
              ? `<button disabled class="w-full rounded-xl bg-stone-300 dark:bg-stone-800 py-4 text-sm font-bold text-stone-550 dark:text-stone-500 cursor-not-allowed text-center">Agotado Temporalmente</button>`
              : `<button id="add-to-cart-btn" class="w-full rounded-xl bg-burgundy-850 hover:bg-burgundy-600 py-4 text-sm font-bold text-white shadow-lg shadow-burgundy-900/10 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-center">
                  🛒 Añadir al carrito
                 </button>`
            }
          </div>

        </div>
      </div>
      `;

      // Registrar Listeners
      // Selección de talla
      document.querySelectorAll(".talla-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          tallaSeleccionada = btn.getAttribute("data-talla");
          renderizarDetalleHTML();
        });
      });

      // Selección de color
      document.querySelectorAll(".color-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          colorSeleccionado = btn.getAttribute("data-color");
          renderizarDetalleHTML();
        });
      });

      // Controles cantidad
      const btnDec = document.getElementById("qty-dec");
      const btnInc = document.getElementById("qty-inc");
      
      btnDec?.addEventListener("click", () => {
        if (cantidadSeleccionada > 1) {
          cantidadSeleccionada--;
          const qtyVal = document.getElementById("qty-val");
          if (qtyVal) qtyVal.textContent = cantidadSeleccionada;
        }
      });

      btnInc?.addEventListener("click", () => {
        if (cantidadSeleccionada < producto.stock) {
          cantidadSeleccionada++;
          const qtyVal = document.getElementById("qty-val");
          if (qtyVal) qtyVal.textContent = cantidadSeleccionada;
        }
      });

      // Agregar al carrito
      const btnAdd = document.getElementById("add-to-cart-btn");
      btnAdd?.addEventListener("click", () => {
        agregarAlCarrito(producto, tallaSeleccionada, colorSeleccionado, cantidadSeleccionada);
        
        // Micro-animación de éxito
        btnAdd.textContent = "✓ ¡Añadido con éxito!";
        btnAdd.classList.remove("bg-burgundy-850");
        btnAdd.classList.add("bg-green-600");
        
        setTimeout(() => {
          renderizarDetalleHTML();
        }, 1500);
      });
    }

    renderizarDetalleHTML();

  } catch (err) {
    container.innerHTML = `
    <div class="py-20 text-center text-red-500">
      <span class="text-5xl">⚠️</span>
      <h3 class="text-lg font-bold mt-4 font-serif">La prenda no existe</h3>
      <p class="text-sm text-stone-500 mt-2">El ID especificado no corresponde a ninguna prenda de nuestra colección.</p>
    </div>
    `;
  }
}

// Retorna un código HEX representativo para el color de costura
function getColorHex(color) {
  const map = {
    "Borgoña": "#800020",
    "Negro": "#000000",
    "Azul Marino": "#000080",
    "Gris Oxford": "#353839",
    "Crema": "#FDF6E2",
    "Blanco": "#FFFFFF",
    "Champán": "#F0E6D2",
    "Verde Esmeralda": "#50C878",
    "Rosa Palo": "#C08A93",
    "Camel": "#C19A6B",
    "Rojo Rubí": "#E0115F",
    "Gris": "#808080"
  };
  return map[color] || "#B76E79";
}
