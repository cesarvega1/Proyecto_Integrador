import { obtenerProductoPorId } from "../../services/product.service.js";
import { renderNavbar, setupNavbar } from "../../components/navbar.js";
import { renderFooter } from "../../components/footer.js";
import { agregarAlCarrito } from "../../utils/cart.js";
import { navigate } from "../../router/router.js";

export function renderDetalle(params) {
  return `
  ${renderNavbar()}

  <main class="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors py-12">
    <div class="mx-auto max-w-5xl px-6">
      
      <!-- Botón de regreso -->
      <div class="mb-8">
        <a href="/productos" data-link class="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-stone-400 hover:text-sport-500 transition-colors">
          ⬅ Volver al catálogo
        </a>
      </div>

      <!-- Contenedor del Detalle -->
      <div id="product-detail-container">
        <!-- Spinner mientras carga -->
        <div class="py-24 flex flex-col items-center justify-center text-slate-400 gap-4">
          <div class="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-sport-500"></div>
          <p class="text-sm font-semibold text-zinc-500">Cargando producto...</p>
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

    // A1 Comment: AI Try-On state variables
    let vtoActive = false;
    let vtoUserImage = null;

    function renderizarDetalleHTML() {
      const sinStock = producto.stock === 0;

      container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm">
        
        <!-- A1 Comment: Columna 1: Imagen y Probador Virtual -->
        <div class="flex flex-col gap-6">
          <div class="relative overflow-hidden rounded-2xl aspect-square bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            <img src="${producto.imagen}" alt="${producto.nombre}" class="w-full h-full object-cover" />
            ${producto.stock <= 3 && producto.stock > 0 
              ? `<span class="absolute top-4 left-4 rounded-full bg-amber-600 px-3.5 py-1 text-[10px] font-black uppercase text-white tracking-wider">¡Pocas unidades!</span>`
              : sinStock 
                ? `<span class="absolute top-4 left-4 rounded-full bg-zinc-700 px-3.5 py-1 text-[10px] font-black uppercase text-white tracking-wider">Agotado</span>`
                : ""
            }
          </div>
          
          <!-- A1 Comment: Try-On UI Panel -->
          <div class="bg-zinc-50 dark:bg-zinc-950 border border-zinc-250 dark:border-zinc-800 rounded-2xl p-5 shadow-inner">
            <div class="flex items-center justify-between mb-3.5">
              <div class="flex items-center gap-1.5">
                <span class="text-xs font-black uppercase tracking-widest text-sport-500 font-display">Probador Virtual IA</span>
                <span class="bg-sport-100 dark:bg-sport-950/40 text-[9px] font-black uppercase tracking-wider text-sport-600 dark:text-sport-400 px-2 py-0.5 rounded-full">AI Live</span>
              </div>
              <span class="text-[10px] text-zinc-400 font-medium">Try-On</span>
            </div>
            
            <p class="text-xs text-slate-500 dark:text-stone-400 mb-4 leading-relaxed font-sans">Sube tu foto para ver cómo te queda esta prenda en tiempo real usando IA generativa.</p>
            
            <!-- A1 Comment: Upload button -->
            <div id="vto-dropzone" class="border border-dashed border-zinc-300 dark:border-zinc-800 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-white dark:bg-zinc-900 hover:border-sport-500 text-center ${vtoActive ? 'hidden' : ''}">
              <svg class="w-7 h-7 text-zinc-400 mb-1.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316A2.192 2.192 0 0 0 14.502 4h-5c-.75 0-1.437.377-1.837 1.004l-.838 1.371Z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.25a3 3 0 1 0 6 0 3 3 0 0 0-6 0Z"></path>
              </svg>
              <span class="text-[10px] font-bold text-slate-700 dark:text-stone-300 uppercase tracking-wider">Subir Foto</span>
              <input type="file" id="vto-file-input" class="hidden" accept="image/*">
            </div>

            <!-- A1 Comment: Live simulator canvas -->
            <div id="vto-sim-area" class="mt-4 ${vtoActive ? '' : 'hidden'}">
              <div class="relative w-full aspect-square bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800 flex items-center justify-center">
                <canvas id="vto-canvas" class="w-full h-full object-contain"></canvas>
                <div id="vto-laser" class="absolute left-0 right-0 h-0.5 bg-green-500 shadow-md shadow-green-500/80 hidden"></div>
                <div id="vto-loader" class="absolute inset-0 bg-zinc-950/70 backdrop-blur-xs flex flex-col items-center justify-center gap-3 hidden">
                  <div class="h-8 w-8 animate-spin rounded-full border-3 border-zinc-700 border-t-green-500"></div>
                  <p class="text-[10px] font-mono text-zinc-300" id="vto-loader-text">AI loading...</p>
                </div>
              </div>
              <button id="vto-reset-btn" class="w-full mt-3 rounded-lg border border-zinc-300 dark:border-zinc-800 text-[10px] font-black uppercase text-slate-700 dark:text-stone-300 py-2.5 transition-colors hover:border-red-500 hover:text-red-500 cursor-pointer">Reiniciar Probador</button>
            </div>
          </div>
        </div>

        <!-- Columna 2: Ficha Técnica -->
        <div class="flex flex-col justify-between">
          <div>
            <span class="text-xs font-bold uppercase tracking-widest text-sport-500">${producto.categoria}</span>
            <h1 class="text-3xl sm:text-4xl font-black uppercase text-zinc-900 dark:text-white font-display mt-2">${producto.nombre}</h1>
            
            <div class="mt-4 flex items-baseline gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <span class="text-3xl font-extrabold text-sport-500 dark:text-sport-400 font-display">$${producto.precio.toLocaleString()}</span>
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
                  return `<button class="talla-btn px-4 h-11 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    act 
                      ? "bg-sport-500 border-sport-500 text-white shadow-sm" 
                      : "border-zinc-300 dark:border-zinc-700 text-slate-700 dark:text-stone-300 hover:border-sport-500"
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
                      ? "bg-sport-100 border-sport-500 text-sport-700 dark:bg-sport-950/20 dark:text-sport-400" 
                      : "border-zinc-300 dark:border-zinc-700 text-slate-700 dark:text-stone-300 hover:border-sport-500"
                  }" data-color="${color}">
                    <span class="h-2.5 w-2.5 rounded-full inline-block" style="background-color: ${getColorHex(color)}"></span>
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
                <button id="qty-dec" class="w-10 h-10 rounded-lg border border-zinc-300 dark:border-zinc-700 text-sm font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer">-</button>
                <span id="qty-val" class="w-12 text-center text-sm font-bold text-slate-800 dark:text-white">${cantidadSeleccionada}</span>
                <button id="qty-inc" class="w-10 h-10 rounded-lg border border-zinc-300 dark:border-zinc-700 text-sm font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer">+</button>
                <span class="text-xs text-slate-400 dark:text-stone-500">(${producto.stock} disponibles en stock)</span>
              </div>
            </div>
            ` : ""}

          </div>

          <!-- Acciones de Compra -->
          <div class="mt-10 pt-6 border-t border-zinc-200 dark:border-zinc-800">
            ${sinStock 
              ? `<button disabled class="w-full rounded-xl bg-zinc-200 dark:bg-zinc-800 py-4 text-sm font-bold text-zinc-500 dark:text-stone-500 cursor-not-allowed text-center">Agotado Temporalmente</button>`
              : `<button id="add-to-cart-btn" class="w-full rounded-xl bg-sport-500 hover:bg-sport-600 py-4 text-sm font-bold text-white shadow-lg shadow-sport-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-center flex items-center justify-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                  Añadir al carrito
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

      // Add to cart
      const btnAdd = document.getElementById("add-to-cart-btn");
      btnAdd?.addEventListener("click", () => {
        agregarAlCarrito(producto, tallaSeleccionada, colorSeleccionado, cantidadSeleccionada);
        
        // Micro-animación de éxito
        btnAdd.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg> ¡Añadido con éxito!`;
        btnAdd.classList.remove("bg-sport-500");
        btnAdd.classList.add("bg-green-600");
        
        setTimeout(() => {
          renderizarDetalleHTML();
        }, 1500);
      });

      // A1 Comment: Start Try-on events
      initVTOEvents();
    }

    // A1 Comment: Setup uploader and canvas events
    function initVTOEvents() {
      const dropzone = document.getElementById("vto-dropzone");
      const fileInput = document.getElementById("vto-file-input");
      const resetBtn = document.getElementById("vto-reset-btn");

      if (!document.getElementById("vto-scan-style")) {
        const style = document.createElement("style");
        style.id = "vto-scan-style";
        style.innerHTML = `
          @keyframes vtoLaser {
            0% { top: 0%; }
            50% { top: 100%; }
            100% { top: 0%; }
          }
          .vto-laser-line {
            animation: vtoLaser 2.2s ease-in-out infinite;
          }
        `;
        document.head.appendChild(style);
      }

      dropzone?.addEventListener("click", () => fileInput?.click());

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
          handleVTOImage(e.dataTransfer.files[0]);
        }
      });

      fileInput?.addEventListener("change", (e) => {
        const target = e.target;
        if (target.files?.length) {
          handleVTOImage(target.files[0]);
        }
      });

      resetBtn?.addEventListener("click", () => {
        vtoActive = false;
        vtoUserImage = null;
        renderizarDetalleHTML();
      });

      // A1 Comment: Redraw if active
      if (vtoActive && vtoUserImage) {
        drawVTOSimulation(vtoUserImage);
      }
    }

    // A1 Comment: Load file and run scanner
    function handleVTOImage(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imgData = e.target?.result;
        const img = new Image();
        img.onload = () => {
          vtoActive = true;
          vtoUserImage = img;
          
          const simArea = document.getElementById("vto-sim-area");
          const dropzone = document.getElementById("vto-dropzone");
          if (simArea) simArea.classList.remove("hidden");
          if (dropzone) dropzone.classList.add("hidden");

          const laser = document.getElementById("vto-laser");
          const loader = document.getElementById("vto-loader");
          const loaderText = document.getElementById("vto-loader-text");

          if (laser) {
            laser.classList.remove("hidden");
            laser.classList.add("vto-laser-line");
          }
          if (loader) loader.classList.remove("hidden");

          let step = 0;
          const steps = [
            "[AI] Analizando cuerpo...",
            "[AI] Escaneando silueta...",
            "[AI] Adaptando prenda...",
            "[AI] Renderizando iluminación..."
          ];

          // A1 Comment: Write fit progress
          const timer = setInterval(() => {
            if (step < steps.length) {
              if (loaderText) loaderText.textContent = steps[step];
              step++;
            } else {
              clearInterval(timer);
              if (laser) {
                laser.classList.add("hidden");
                laser.classList.remove("vto-laser-line");
              }
              if (loader) loader.classList.add("hidden");
              drawVTOSimulation(img);
            }
          }, 650);
        };
        if (imgData) img.src = imgData;
      };
      reader.readAsDataURL(file);
    }

    // A1 Comment: Overlay garment onto user photo
    function drawVTOSimulation(userImg) {
      const canvas = document.getElementById("vto-canvas");
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(userImg, 0, 0, canvas.width, canvas.height);

      // A1 Comment: Draw shop clothing on top
      const prodImg = new Image();
      prodImg.onload = () => {
        ctx.shadowColor = "#e05c1a";
        ctx.shadowBlur = 18;

        let px = canvas.width * 0.25;
        let py = canvas.height * 0.22;
        let pw = canvas.width * 0.5;
        let ph = canvas.height * 0.5;

        if (producto.categoria === "Calzado") {
          py = canvas.height * 0.58;
          ph = canvas.height * 0.32;
        } else if (producto.categoria === "Balones") {
          px = canvas.width * 0.35;
          py = canvas.height * 0.45;
          pw = canvas.width * 0.3;
          ph = canvas.height * 0.3;
        }

        ctx.drawImage(prodImg, px, py, pw, ph);
        ctx.shadowBlur = 0;

        ctx.fillStyle = "rgba(16, 185, 129, 0.95)";
        ctx.font = "bold 9px monospace";
        ctx.fillText("✓ AI FIT ACTIVE", 12, 18);

        ctx.strokeStyle = "rgba(16, 185, 129, 0.4)";
        ctx.lineWidth = 1.2;
        ctx.strokeRect(px - 3, py - 3, pw + 6, ph + 6);
      };
      prodImg.src = producto.imagen;
    }

    renderizarDetalleHTML();

  } catch (err) {
    container.innerHTML = `
    <div class="py-20 flex flex-col items-center justify-center text-center text-red-500">
      <svg class="w-16 h-16 text-red-400 dark:text-red-800" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
      <h3 class="text-lg font-black uppercase mt-4 font-display">Producto no encontrado</h3>
      <p class="text-sm text-zinc-500 mt-2">El ID especificado no corresponde a ningún producto en nuestro catálogo.</p>
    </div>
    `;
  }
}

// Retorna un código HEX representativo para el color del producto
function getColorHex(color) {
  const map = {
    "Negro": "#000000",
    "Blanco": "#FFFFFF",
    "Azul Royal": "#4169E1",
    "Azul Marino": "#000080",
    "Rojo": "#DC2626",
    "Naranja Flúor": "#FF6600",
    "Gris": "#808080",
    "Gris/Rojo": "#808080",
    "Negro/Naranja": "#000000",
    "Blanco/Azul": "#FFFFFF",
    "Blanco/Negro": "#FFFFFF",
    "Azul/Blanco": "#4169E1",
    "Verde Oliva": "#708238",
    "Negro/Naranja": "#111111",
  };
  return map[color] || "#e05c1a";
}
