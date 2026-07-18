import { renderNavbar, setupNavbar } from "../../components/navbar.js";
import { renderFooter } from "../../components/footer.js";
import { obtenerCarrito, obtenerTotalCarrito, vaciarCarrito } from "../../utils/cart.js";
import { obtenerSesion } from "../../services/auth.service.js";
import { crearOrden } from "../../services/order.service.js";
import { enviarCorreoConfirmacion } from "../../services/email.service.js";
import { navigate } from "../../router/router.js";

export function renderCheckout() {
  const carrito = obtenerCarrito();

  // Si el carrito está vacío redirige al catálogo
  if (carrito.length === 0) {
    setTimeout(() => navigate("/productos"), 50);
    return ``;
  }

  const usuario = obtenerSesion();
  const subtotal = obtenerTotalCarrito();
  const descPorcentaje = parseInt(sessionStorage.getItem("descuentoPorcentaje") || "0");
  const descuento = subtotal * (descPorcentaje / 100);
  const total = subtotal - descuento;

  return `
  ${renderNavbar()}

  <!-- Modal de Éxito (oculto por defecto) -->
  <div id="success-modal" class="fixed inset-0 z-[999] flex items-center justify-center p-6 hidden">
    <!-- Overlay -->
    <div class="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"></div>

    <!-- Tarjeta del modal -->
    <div class="relative z-10 w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
      <!-- Franja superior naranja -->
      <div class="h-2 bg-gradient-to-r from-sport-500 to-sport-600"></div>

      <div class="p-8 text-center">
        <div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-600">
          <svg class="w-10 h-10 animate-bounce" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>
        </div>

        <span class="text-xs font-bold uppercase tracking-widest text-sport-500 flex items-center justify-center gap-1">
          SportZone
          <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        </span>
        <h2 class="text-2xl font-black uppercase text-zinc-900 dark:text-white font-display mt-2">
          ¡Compra Exitosa!
        </h2>
        <p class="mt-3 text-sm text-slate-500 dark:text-stone-400 leading-relaxed">
          Tu pedido fue registrado correctamente. Hemos enviado un correo de confirmación con el detalle de tu compra.
        </p>

        <!-- Resumen rápido -->
        <div class="mt-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-4 text-left">
          <div class="flex items-center justify-between text-xs text-slate-500 dark:text-stone-400 mb-2">
            <span class="font-bold uppercase tracking-wider">Pedido</span>
            <span id="modal-order-id" class="font-bold text-sport-500">#---</span>
          </div>
          <div class="flex items-center justify-between text-xs text-slate-500 dark:text-stone-400 mb-2">
            <span>Total pagado</span>
            <span id="modal-total" class="font-black text-zinc-900 dark:text-white text-sm">$0</span>
          </div>
          <div class="flex items-center justify-between text-xs text-slate-500 dark:text-stone-400 mb-2">
            <span>Método de pago</span>
            <span id="modal-metodo" class="font-bold text-zinc-700 dark:text-stone-200">---</span>
          </div>
          <div class="flex items-center justify-between text-xs text-slate-500 dark:text-stone-400">
            <span>Confirmación enviada a</span>
            <span id="modal-email" class="font-bold text-zinc-700 dark:text-stone-200 truncate max-w-[150px]">---</span>
          </div>
        </div>

        <!-- Estado email -->
        <div id="modal-email-status" class="mt-4 hidden rounded-xl px-4 py-2.5 text-xs font-semibold"></div>

        <div class="mt-6 grid grid-cols-2 gap-3">
          <button id="modal-dashboard-btn"
            class="rounded-xl border border-zinc-300 dark:border-zinc-700 px-4 py-3 text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
            Mis Pedidos
          </button>
          <button id="modal-continue-btn"
            class="rounded-xl bg-sport-500 hover:bg-sport-600 px-4 py-3 text-xs font-bold text-white transition-all hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            Seguir Comprando
          </button>
        </div>
      </div>
    </div>
  </div>

  <main class="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors py-12">
    <div class="mx-auto max-w-5xl px-6">

      <!-- Cabecera -->
      <div class="mb-10">
        <span class="text-xs font-bold uppercase tracking-widest text-sport-500">Último paso</span>
        <h1 class="text-4xl font-black uppercase text-zinc-900 dark:text-white font-display mt-1">Finalizar Compra</h1>
        <div class="stripe-line text-sport-500 mt-3 w-20"></div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

        <!-- ══════════════════════════════════════
             Formulario de Envío y Pago
        ══════════════════════════════════════ -->
        <div class="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-sm">

          <div id="checkout-error" class="hidden mb-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 px-4 py-3 text-sm text-red-600 dark:text-red-400"></div>

          <form id="checkout-form" class="grid gap-8">

            <!-- 1. Datos de Despacho -->
            <div>
              <h3 class="text-base font-black uppercase text-zinc-900 dark:text-white font-display mb-5 pb-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
                <span class="flex h-7 w-7 items-center justify-center rounded-full bg-sport-500 text-white text-xs font-black">1</span>
                Datos de Despacho
              </h3>

              <div class="grid gap-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400 mb-2" for="client-name">Nombre Completo</label>
                    <input id="client-name" type="text" value="${usuario ? usuario.name + " " + usuario.lastName : ""}" required
                      class="w-full rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 px-4 py-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-sport-500 transition-colors" />
                  </div>
                  <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400 mb-2" for="client-email">Correo Electrónico</label>
                    <input id="client-email" type="email" value="${usuario?.email || ""}" placeholder="tucorreo@ejemplo.com" required
                      class="w-full rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 px-4 py-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-sport-500 transition-colors" />
                    <p class="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                      Aquí recibirás la confirmación de tu compra
                    </p>
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400 mb-2" for="shipping-address">Dirección de Entrega</label>
                  <input id="shipping-address" type="text" placeholder="Calle, Carrera, Barrio, Apto..." required
                    class="w-full rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 px-4 py-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-sport-500 transition-colors" />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400 mb-2" for="shipping-city">Ciudad / Municipio</label>
                    <input id="shipping-city" type="text" placeholder="Bogotá, Medellín..." required
                      class="w-full rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 px-4 py-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-sport-500 transition-colors" />
                  </div>
                  <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400 mb-2" for="shipping-phone">Número Celular</label>
                    <input id="shipping-phone" type="tel" placeholder="+57 300 000 0000" required
                      class="w-full rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 px-4 py-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-sport-500 transition-colors" />
                  </div>
                </div>
              </div>
            </div>

            <!-- 2. Método de Pago -->
            <div>
              <h3 class="text-base font-black uppercase text-zinc-900 dark:text-white font-display mb-5 pb-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
                <span class="flex h-7 w-7 items-center justify-center rounded-full bg-sport-500 text-white text-xs font-black">2</span>
                Método de Pago
              </h3>

              <div class="grid grid-cols-2 gap-4 mb-6">
                <!-- Tarjeta -->
                <label id="label-tarjeta" class="flex items-center gap-3 p-4 rounded-2xl border-2 border-sport-500 bg-sport-50 dark:bg-sport-950/10 cursor-pointer transition-all">
                  <input type="radio" name="payment-method" value="tarjeta" checked class="accent-sport-500" />
                  <div>
                    <span class="text-xs font-black text-zinc-800 dark:text-stone-200 flex items-center gap-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                      Tarjeta de Crédito
                    </span>
                    <span class="text-[10px] text-slate-400">Visa · Mastercard · Amex</span>
                  </div>
                </label>

                <!-- Transferencia -->
                <label id="label-transferencia" class="flex items-center gap-3 p-4 rounded-2xl border-2 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 cursor-pointer hover:border-sport-500 transition-all">
                  <input type="radio" name="payment-method" value="transferencia" class="accent-sport-500" />
                  <div>
                    <span class="text-xs font-black text-zinc-800 dark:text-stone-200 flex items-center gap-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path></svg>
                      Transferencia Bancaria
                    </span>
                    <span class="text-[10px] text-slate-400">Verificación 24h</span>
                  </div>
                </label>
              </div>

              <!-- Formulario Tarjeta -->
              <div id="card-fields" class="grid gap-4 p-5 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Datos de Tarjeta</span>
                  <div class="flex gap-1 ml-auto text-slate-400">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                  </div>
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400 mb-2" for="card-number">Número de Tarjeta</label>
                  <input id="card-number" type="text" placeholder="4000 1234 5678 9010" maxlength="19" required
                    class="w-full rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-4 py-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-sport-500 transition-colors font-mono" />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400 mb-2" for="card-expiry">Vencimiento</label>
                    <input id="card-expiry" type="text" placeholder="MM/AA" maxlength="5" required
                      class="w-full rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-4 py-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-sport-500 transition-colors font-mono" />
                  </div>
                  <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400 mb-2" for="card-cvv">CVV</label>
                    <input id="card-cvv" type="password" placeholder="•••" maxlength="3" required
                      class="w-full rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 px-4 py-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-sport-500 transition-colors font-mono" />
                  </div>
                </div>
              </div>

              <div id="transfer-instructions" class="hidden p-5 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <span class="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-sport-500 mb-3">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                  Instrucciones de Pago:
                </span>
                <div class="text-xs text-slate-600 dark:text-stone-300 leading-relaxed space-y-2">
                  <div class="flex items-start gap-2">
                    <span class="text-sport-500 font-bold shrink-0">①</span>
                    <span>Realiza una transferencia por <strong class="text-zinc-900 dark:text-white">$${total.toLocaleString()}</strong> a la cuenta corriente Bancolombia <strong>987-654321-01</strong> a nombre de <strong>SportZone S.A.S.</strong></span>
                  </div>
                  <div class="flex items-start gap-2">
                    <span class="text-sport-500 font-bold shrink-0">②</span>
                    <span>Envía el comprobante con el ID de tu orden a: <strong class="text-sport-500">pagos@sportzone.com.co</strong></span>
                  </div>
                  <div class="flex items-start gap-2">
                    <span class="text-sport-500 font-bold shrink-0">③</span>
                    <span>Verificaremos tu pago en un máximo de <strong>24 horas hábiles</strong>.</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Botón Confirmar -->
            <div class="pt-2">
              <button id="submit-btn" type="submit"
                class="w-full rounded-2xl bg-sport-500 hover:bg-sport-600 py-4 text-sm font-black uppercase text-white shadow-lg shadow-sport-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-center tracking-wide flex items-center justify-center gap-2">
                <span id="submit-btn-text" class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  Confirmar Pedido — $${total.toLocaleString()}
                </span>
                <svg id="submit-spinner" class="hidden animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
              </button>
              <p class="flex items-center justify-center gap-1 text-[10px] text-slate-400 mt-3">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                Transacción segura · Datos encriptados SSL
              </p>
            </div>

          </form>
        </div>

        <!-- ══════════════════════════════════════
             Resumen de Pedido (sidebar)
        ══════════════════════════════════════ -->
        <div class="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-7 shadow-sm sticky top-24">
          <h3 class="text-base font-black uppercase text-zinc-900 dark:text-white font-display mb-5 pb-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            Resumen
          </h3>

          <!-- Lista de items -->
          <div class="grid gap-4 max-h-72 overflow-y-auto mb-5 pr-1">
            ${carrito.map(item => `
              <div class="flex items-center gap-3 text-xs">
                <div class="w-11 h-11 rounded-xl overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                  <img src="${item.imagen}" class="w-full h-full object-cover" alt="${item.nombre}" />
                </div>
                <div class="flex-1 min-w-0">
                  <span class="block font-bold text-zinc-900 dark:text-white truncate">${item.nombre}</span>
                  <span class="text-zinc-400 text-[10px]">Talla: ${item.talla} · x${item.cantidad}</span>
                </div>
                <span class="font-black text-sport-500 shrink-0">$${(item.precio * item.cantidad).toLocaleString()}</span>
              </div>
            `).join("")}
          </div>

          <div class="h-px bg-zinc-200 dark:bg-zinc-800 my-4"></div>

          <!-- Totales -->
          <div class="grid gap-2.5 text-xs text-slate-500 dark:text-stone-400">
            <div class="flex items-center justify-between">
              <span>Subtotal</span>
              <span class="font-bold text-zinc-800 dark:text-white">$${subtotal.toLocaleString()}</span>
            </div>

            ${descuento > 0 ? `
            <div class="flex items-center justify-between text-green-500">
              <span>Descuento (${descPorcentaje}%)</span>
              <span class="font-bold">−$${descuento.toLocaleString()}</span>
            </div>
            ` : ""}

            <div class="flex items-center justify-between">
              <span>Envío</span>
              <span class="font-bold text-green-500">GRATIS</span>
            </div>

            <div class="h-px bg-zinc-200 dark:bg-zinc-800 my-1"></div>

            <div class="flex items-center justify-between">
              <span class="text-sm font-black uppercase text-zinc-900 dark:text-white font-display">Total</span>
              <span class="text-xl font-black text-sport-500 font-display">$${total.toLocaleString()}</span>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap gap-2">
            <span class="text-[10px] font-semibold text-zinc-400 flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg> SSL
            </span>
            <span class="text-[10px] font-semibold text-zinc-400 flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg> Envío gratis
            </span>
            <span class="text-[10px] font-semibold text-zinc-400 flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg> 30 días devolución
            </span>
          </div>
        </div>

      </div>
    </div>
  </main>

  ${renderFooter()}
  `;
}

// ---------------------------------------------------------
// SETUP
// ---------------------------------------------------------
export function setupCheckout() {
  setupNavbar();

  const form = document.getElementById("checkout-form");
  const cardFields = document.getElementById("card-fields");
  const transferInstructions = document.getElementById("transfer-instructions");
  const errorBox = document.getElementById("checkout-error");
  const labelTarjeta = document.getElementById("label-tarjeta");
  const labelTransferencia = document.getElementById("label-transferencia");
  const submitBtn = document.getElementById("submit-btn");
  const submitText = document.getElementById("submit-btn-text");
  const submitSpinner = document.getElementById("submit-spinner");

  if (!form) return;

  // -- Toggle payment methods --
  document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
    radio.addEventListener("change", (e) => {
      if (e.target.value === "tarjeta") {
        // Show card
        cardFields.classList.remove("hidden");
        transferInstructions.classList.add("hidden");
        document.getElementById("card-number").setAttribute("required", "required");
        document.getElementById("card-expiry").setAttribute("required", "required");
        document.getElementById("card-cvv").setAttribute("required", "required");
        // Active / inactive styles
        labelTarjeta.classList.replace("border-zinc-300", "border-sport-500");
        labelTarjeta.classList.add("bg-sport-50", "dark:bg-sport-950/10");
        labelTransferencia.classList.replace("border-sport-500", "border-zinc-300");
        labelTransferencia.classList.remove("bg-sport-50", "dark:bg-sport-950/10");
      } else {
        // Show transfer
        cardFields.classList.add("hidden");
        transferInstructions.classList.remove("hidden");
        document.getElementById("card-number").removeAttribute("required");
        document.getElementById("card-expiry").removeAttribute("required");
        document.getElementById("card-cvv").removeAttribute("required");
        // Active / inactive styles
        labelTransferencia.classList.replace("border-zinc-300", "border-sport-500");
        labelTransferencia.classList.add("bg-sport-50", "dark:bg-sport-950/10");
        labelTarjeta.classList.replace("border-sport-500", "border-zinc-300");
        labelTarjeta.classList.remove("bg-sport-50", "dark:bg-sport-950/10");
      }
    });
  });

  // -- Auto format card number --
  document.getElementById("card-number")?.addEventListener("input", (e) => {
    let v = e.target.value.replace(/\D/g, "");
    v = v.match(/.{1,4}/g)?.join(" ") || v;
    e.target.value = v;
  });

  // -- Auto format expiration date --
  document.getElementById("card-expiry")?.addEventListener("input", (e) => {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2, 4);
    e.target.value = v;
  });

  // -- Modal buttons --
  document.getElementById("modal-dashboard-btn")?.addEventListener("click", () => navigate("/dashboard"));
  document.getElementById("modal-continue-btn")?.addEventListener("click", () => navigate("/productos"));

  // -- Submit order --
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const usuario = obtenerSesion();
    const carrito = obtenerCarrito();
    const subtotal = obtenerTotalCarrito();
    const descPorcentaje = parseInt(sessionStorage.getItem("descuentoPorcentaje") || "0");
    const descuento = subtotal * (descPorcentaje / 100);
    const total = subtotal - descuento;

    const nombre = document.getElementById("client-name").value.trim();
    const email = document.getElementById("client-email").value.trim();
    const address = document.getElementById("shipping-address").value.trim();
    const city = document.getElementById("shipping-city").value.trim();
    const phone = document.getElementById("shipping-phone").value.trim();
    const metodoVal = document.querySelector('input[name="payment-method"]:checked').value;

    const metodosMapeo = {
      tarjeta: "Tarjeta de Crédito",
      transferencia: "Transferencia Bancaria"
    };

    // Build order object
    const orden = {
      userId: usuario.id,
      fecha: new Date().toISOString().split("T")[0],
      productos: carrito.map(item => ({
        productoId: item.id,
        nombre: item.nombre,
        cantidad: item.cantidad,
        talla: item.talla,
        color: item.color,
        precioUnitario: item.precio
      })),
      total,
      estado: "Confirmada",
      direccionEnvio: `${address}, ${city}`,
      telefono: phone,
      metodoPago: metodosMapeo[metodoVal]
    };

    // Show spinner on button
    submitText.textContent = "Procesando...";
    submitBtn.disabled = true;
    submitSpinner.classList.remove("hidden");
    errorBox.classList.add("hidden");

    try {
      // 1. Save order in database
      const nuevaOrden = await crearOrden(orden);
      vaciarCarrito();
      sessionStorage.removeItem("descuentoPorcentaje");

      // 2. Fill success modal data
      document.getElementById("modal-order-id").textContent = `#${nuevaOrden.id ?? "---"}`;
      document.getElementById("modal-total").textContent = `$${total.toLocaleString()}`;
      document.getElementById("modal-metodo").textContent = metodosMapeo[metodoVal];
      document.getElementById("modal-email").textContent = email;

      // 3. Show modal
      document.getElementById("success-modal").classList.remove("hidden");

      // 4. Try to send confirmation email
      const emailStatusDiv = document.getElementById("modal-email-status");
      try {
        await enviarCorreoConfirmacion({ ...nuevaOrden, ...orden }, email, nombre);
        emailStatusDiv.innerHTML = `<span class="flex items-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg> Correo de confirmación enviado exitosamente.</span>`;
        emailStatusDiv.className = "mt-4 rounded-xl px-4 py-2.5 text-xs font-semibold bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800";
        emailStatusDiv.classList.remove("hidden");
      } catch (emailErr) {
        console.error("Error al enviar correo:", emailErr);
        emailStatusDiv.innerHTML = `<span class="flex items-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg> No se pudo enviar el correo. Revisa tu configuración de EmailJS.</span>`;
        emailStatusDiv.className = "mt-4 rounded-xl px-4 py-2.5 text-xs font-semibold bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800";
        emailStatusDiv.classList.remove("hidden");
      }

    } catch (err) {
      // Error saving order (e.g. no stock)
      errorBox.innerHTML = `<span class="flex items-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg> ${err.message || "No se pudo procesar el pedido. Verifica que el servidor API esté activo."}</span>`;
      errorBox.classList.remove("hidden");

      // Restore button
      submitText.innerHTML = `<span class="flex items-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg> Confirmar Pedido — $${total.toLocaleString()}</span>`;
      submitBtn.disabled = false;
      submitSpinner.classList.add("hidden");
    }
  });
}
