import { renderNavbar, setupNavbar } from "../../components/navbar.js";
import { renderFooter } from "../../components/footer.js";
import { obtenerCarrito, eliminarDelCarrito, actualizarCantidad, obtenerTotalCarrito } from "../../utils/cart.js";
import { navigate } from "../../router/router.js";
import { obtenerSesion } from "../../services/auth.service.js";

let descuentoPorcentaje = 0;
let codigoCupon = "";
let mensajeCupon = "";

export function renderCart() {
  const carrito = obtenerCarrito();
  const subtotal = obtenerTotalCarrito();
  const descuento = subtotal * (descuentoPorcentaje / 100);
  const total = subtotal - descuento;
  const usuario = obtenerSesion();

  let contenidoHtml = "";

  if (carrito.length === 0) {
    contenidoHtml = `
    <div class="py-24 text-center text-slate-400 bg-cream-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-850 rounded-3xl shadow-sm">
      <span class="text-7xl">🧺</span>
      <h2 class="text-2xl font-bold text-slate-800 dark:text-white mt-6 font-serif">Tu bolsa de compras está vacía</h2>
      <p class="text-sm text-stone-500 mt-2">¿Aún no has seleccionado tus prendas a medida? Explora nuestro catálogo.</p>
      <div class="mt-8">
        <a class="rounded-full bg-burgundy-850 hover:bg-burgundy-600 px-8 py-3.5 text-sm font-bold text-white transition-all shadow-md inline-block" 
           href="/productos" data-link>Ver Nueva Colección</a>
      </div>
    </div>
    `;
  } else {
    contenidoHtml = `
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
      
      <!-- Columna Izquierda: Listado de Prendas -->
      <div class="lg:col-span-2 grid gap-6">
        ${carrito.map(item => {
          return `
          <div class="flex flex-col sm:flex-row items-center gap-6 rounded-3xl bg-cream-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-6 shadow-sm transition-colors">
            
            <!-- Imagen -->
            <div class="w-24 h-24 rounded-2xl overflow-hidden bg-stone-150 border border-stone-200 dark:border-stone-800 shrink-0">
              <img src="${item.imagen}" alt="${item.nombre}" class="w-full h-full object-cover" />
            </div>

            <!-- Datos de Prenda -->
            <div class="flex-1 text-center sm:text-left">
              <h3 class="text-base font-bold text-slate-900 dark:text-stone-100 font-serif">${item.nombre}</h3>
              <div class="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-1.5 text-xs text-slate-500 dark:text-stone-400">
                <span>Talla: <strong class="text-slate-800 dark:text-stone-200">${item.talla}</strong></span>
                <span class="h-1 w-1 rounded-full bg-stone-300 dark:bg-stone-700"></span>
                <span>Color: <strong class="text-slate-800 dark:text-stone-200">${item.color}</strong></span>
              </div>
              <span class="block text-sm font-extrabold text-burgundy-850 dark:text-rosegold-400 font-serif mt-3">$${item.precio.toLocaleString()} c/u</span>
            </div>

            <!-- Cantidad y Borrado -->
            <div class="flex sm:flex-col items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-stone-200 dark:border-stone-800">
              
              <!-- Controles de Cantidad -->
              <div class="flex items-center gap-2">
                <button class="cart-qty-dec w-8 h-8 rounded-lg border border-stone-300 dark:border-stone-800 text-xs font-bold hover:bg-stone-100 dark:hover:bg-stone-850 cursor-pointer"
                  data-id="${item.id}" data-talla="${item.talla}" data-color="${item.color}">-</button>
                <span class="w-8 text-center text-xs font-bold">${item.cantidad}</span>
                <button class="cart-qty-inc w-8 h-8 rounded-lg border border-stone-300 dark:border-stone-800 text-xs font-bold hover:bg-stone-100 dark:hover:bg-stone-850 cursor-pointer"
                  data-id="${item.id}" data-talla="${item.talla}" data-color="${item.color}" data-max="${item.stockMaximo}">+</button>
              </div>

              <!-- Eliminar -->
              <button class="cart-remove-btn text-xs font-bold text-red-500 hover:text-red-700 transition-colors flex items-center gap-1 cursor-pointer"
                data-id="${item.id}" data-talla="${item.talla}" data-color="${item.color}">
                🗑️ Eliminar
              </button>

            </div>

          </div>
          `;
        }).join("")}
      </div>

      <!-- Columna Derecha: Resumen de Compra -->
      <div class="rounded-3xl bg-cream-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-8 shadow-sm">
        <h3 class="text-xl font-bold text-burgundy-850 dark:text-stone-100 font-serif mb-6 pb-4 border-b border-stone-200 dark:border-stone-850">Resumen del Pedido</h3>
        
        <div class="grid gap-4 text-sm">
          <div class="flex items-center justify-between text-slate-600 dark:text-stone-400">
            <span>Subtotal</span>
            <span class="font-bold text-slate-800 dark:text-white">$${subtotal.toLocaleString()}</span>
          </div>

          ${descuento > 0 ? `
          <div class="flex items-center justify-between text-green-600">
            <span>Descuento (${descuentoPorcentaje}%)</span>
            <span class="font-bold">-$${descuento.toLocaleString()}</span>
          </div>
          ` : ""}

          <div class="flex items-center justify-between text-slate-600 dark:text-stone-400">
            <span>Costo de Envío</span>
            <span class="font-bold text-green-600">Gratuito</span>
          </div>

          <div class="h-px bg-stone-200 dark:bg-stone-800 my-2"></div>

          <div class="flex items-center justify-between text-base font-bold text-burgundy-850 dark:text-rosegold-400 font-serif">
            <span>Total</span>
            <span class="text-xl">$${total.toLocaleString()}</span>
          </div>
        </div>

        <!-- Sección de Cupón -->
        <div class="mt-8 pt-6 border-t border-stone-200 dark:border-stone-800">
          <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400 mb-2" for="coupon-input">Cupón de Descuento</label>
          <div class="flex gap-2">
            <input id="coupon-input" type="text" placeholder="Código" value="${codigoCupon}"
              class="w-full rounded-xl bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 px-3 py-2 text-xs uppercase text-slate-850 dark:text-white focus:outline-none focus:border-rosegold-500 transition-colors" />
            <button id="coupon-apply-btn" class="rounded-xl bg-stone-200 dark:bg-stone-800 hover:bg-rosegold-500 hover:text-white text-stone-750 dark:text-stone-300 px-4 py-2 text-xs font-bold transition-all cursor-pointer">
              Aplicar
            </button>
          </div>
          ${mensajeCupon ? `<p class="mt-2 text-xs font-semibold ${descuentoPorcentaje > 0 ? "text-green-600" : "text-red-500"}">${mensajeCupon}</p>` : ""}
        </div>

        <!-- Botón Checkout -->
        <div class="mt-8">
          <button id="checkout-proceed-btn" class="w-full rounded-xl bg-burgundy-850 hover:bg-burgundy-600 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-center">
            ${usuario ? "Proceder al Checkout ➔" : "Iniciar Sesión para Comprar ➔"}
          </button>
        </div>

      </div>

    </div>
    `;
  }

  return `
  ${renderNavbar()}

  <main class="min-h-screen bg-stone-50 dark:bg-stone-950 transition-colors py-12">
    <div class="mx-auto max-w-5xl px-6">
      
      <div class="mb-12">
        <h1 class="text-4xl font-bold text-burgundy-850 dark:text-rosegold-400 font-serif">Carrito del SportZone</h1>
        <div class="borde-hilado text-transparent h-px mt-4 w-24"></div>
      </div>

      <div id="cart-content-container">
        ${contenidoHtml}
      </div>

    </div>
  </main>

  ${renderFooter()}
  `;
}

function recargarCarrito() {
  const container = document.getElementById("cart-content-container");
  if (container) {
    // Para simplificar, volvemos a renderizar el bloque interior
    const dummyDiv = document.createElement("div");
    dummyDiv.innerHTML = renderCart();
    // Extraemos solo el contenedor del contenido
    const nuevoContenido = dummyDiv.querySelector("#cart-content-container").innerHTML;
    container.innerHTML = nuevoContenido;
    // Volvemos a atar los eventos
    vincularEventosCarrito();
  }
}

function vincularEventosCarrito() {
  // Incrementar cantidad
  document.querySelectorAll(".cart-qty-inc").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.getAttribute("data-id"));
      const talla = btn.getAttribute("data-talla");
      const color = btn.getAttribute("data-color");
      const max = parseInt(btn.getAttribute("data-max"));
      
      const carrito = obtenerCarrito();
      const item = carrito.find(x => x.id === id && x.talla === talla && x.color === color);
      if (item && item.cantidad < max) {
        actualizarCantidad(id, talla, color, item.cantidad + 1);
        recargarCarrito();
      }
    });
  });

  // Decrementar cantidad
  document.querySelectorAll(".cart-qty-dec").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.getAttribute("data-id"));
      const talla = btn.getAttribute("data-talla");
      const color = btn.getAttribute("data-color");
      
      const carrito = obtenerCarrito();
      const item = carrito.find(x => x.id === id && x.talla === talla && x.color === color);
      if (item && item.cantidad > 1) {
        actualizarCantidad(id, talla, color, item.cantidad - 1);
        recargarCarrito();
      }
    });
  });

  // Eliminar producto
  document.querySelectorAll(".cart-remove-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.getAttribute("data-id"));
      const talla = btn.getAttribute("data-talla");
      const color = btn.getAttribute("data-color");
      
      eliminarDelCarrito(id, talla, color);
      recargarCarrito();
    });
  });

  // Aplicar cupón
  const applyBtn = document.getElementById("coupon-apply-btn");
  applyBtn?.addEventListener("click", () => {
    const input = document.getElementById("coupon-input");
    const cod = input?.value.trim().toUpperCase() || "";
    codigoCupon = cod;

    if (cod === "ATELIER10") {
      descuentoPorcentaje = 10;
      mensajeCupon = " Cupón aplicado. Descuento del 10% activado.";
    } else if (cod === "") {
      descuentoPorcentaje = 0;
      mensajeCupon = "";
    } else {
      descuentoPorcentaje = 0;
      mensajeCupon = "✕ Cupón inválido.";
    }
    recargarCarrito();
  });

  // Proceder a checkout
  const checkoutBtn = document.getElementById("checkout-proceed-btn");
  checkoutBtn?.addEventListener("click", () => {
    const usuario = obtenerSesion();
    if (!usuario) {
      navigate("/login");
    } else {
      // Guardar el descuento en sessionStorage para usarlo en el Checkout
      sessionStorage.setItem("descuentoPorcentaje", descuentoPorcentaje);
      navigate("/checkout");
    }
  });
}

export function setupCart() {
  setupNavbar();
  vincularEventosCarrito();
}
