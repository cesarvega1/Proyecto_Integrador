import { renderNavbar, setupNavbar } from "../../components/navbar.js";
import { renderFooter } from "../../components/footer.js";
import { obtenerCarrito, obtenerTotalCarrito, vaciarCarrito } from "../../utils/cart.js";
import { obtenerSesion } from "../../services/auth.service.js";
import { crearOrden } from "../../services/order.service.js";
import { navigate } from "../../router/router.js";

export function renderCheckout() {
  const carrito = obtenerCarrito();
  
  // Si el carrito está vacío, no se puede hacer checkout, redirige
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

  <main class="min-h-screen bg-stone-50 dark:bg-stone-950 transition-colors py-12">
    <div class="mx-auto max-w-5xl px-6">
      
      <div class="mb-12">
        <h1 class="text-4xl font-bold text-burgundy-850 dark:text-rosegold-400 font-serif">Checkout de Compra</h1>
        <div class="borde-hilado text-transparent h-px mt-4 w-24"></div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        
        <!-- Formulario de Envío y Pago -->
        <div class="lg:col-span-2 bg-cream-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-850 rounded-3xl p-8 shadow-sm">
          
          <div id="checkout-error" class="hidden mb-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 px-4 py-3 text-sm text-red-650 dark:text-red-400"></div>

          <form id="checkout-form" class="grid gap-6">
            
            <!-- Datos de Envío -->
            <div>
              <h3 class="text-lg font-bold text-burgundy-850 dark:text-rosegold-400 font-serif mb-4 pb-2 border-b border-stone-200 dark:border-stone-800">1. Datos de Despacho</h3>
              
              <div class="grid gap-4">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400 mb-2" for="client-name">Nombre Completo</label>
                  <input id="client-name" type="text" value="${usuario ? usuario.name + ' ' + usuario.lastName : ''}" required
                    class="w-full rounded-xl bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 px-4 py-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-rosegold-500" />
                </div>
                
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400 mb-2" for="shipping-address">Dirección de Entrega</label>
                  <input id="shipping-address" type="text" placeholder="Calle, Carrera, Barrio, Apto..." required
                    class="w-full rounded-xl bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 px-4 py-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-rosegold-500" />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400 mb-2" for="shipping-city">Ciudad / Municipio</label>
                    <input id="shipping-city" type="text" placeholder="Bogotá, Medellín..." required
                      class="w-full rounded-xl bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 px-4 py-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-rosegold-500" />
                  </div>
                  <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400 mb-2" for="shipping-phone">Número Celular</label>
                    <input id="shipping-phone" type="tel" placeholder="+57 300 000 0000" required
                      class="w-full rounded-xl bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 px-4 py-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-rosegold-500" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Método de Pago -->
            <div class="mt-4">
              <h3 class="text-lg font-bold text-burgundy-850 dark:text-rosegold-400 font-serif mb-4 pb-2 border-b border-stone-200 dark:border-stone-800">2. Método de Pago</h3>
              
              <div class="grid grid-cols-2 gap-4 mb-6">
                <!-- Tarjeta -->
                <label class="flex items-center gap-3 p-4 rounded-xl border border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-950 cursor-pointer hover:border-rosegold-500">
                  <input type="radio" name="payment-method" value="tarjeta" checked class="accent-rosegold-500" />
                  <div>
                    <span class="block text-xs font-bold text-slate-800 dark:text-stone-200">Tarjeta de Crédito</span>
                    <span class="text-[10px] text-slate-400">Aprobación Inmediata</span>
                  </div>
                </label>

                <!-- Transferencia -->
                <label class="flex items-center gap-3 p-4 rounded-xl border border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-950 cursor-pointer hover:border-rosegold-500">
                  <input type="radio" name="payment-method" value="transferencia" class="accent-rosegold-500" />
                  <div>
                    <span class="block text-xs font-bold text-slate-800 dark:text-stone-200">Transferencia Bancaria</span>
                    <span class="text-[10px] text-slate-400">Verificación 24h</span>
                  </div>
                </label>
              </div>

              <!-- Formulario Tarjeta -->
              <div id="card-fields" class="grid gap-4">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400 mb-2" for="card-number">Número de Tarjeta</label>
                  <input id="card-number" type="text" placeholder="4000 1234 5678 9010" maxlength="19" required
                    class="w-full rounded-xl bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 px-4 py-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-rosegold-500" />
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400 mb-2" for="card-expiry">Fecha Expiración</label>
                    <input id="card-expiry" type="text" placeholder="MM/AA" maxlength="5" required
                      class="w-full rounded-xl bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 px-4 py-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-rosegold-500" />
                  </div>
                  <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400 mb-2" for="card-cvv">CVV</label>
                    <input id="card-cvv" type="password" placeholder="123" maxlength="3" required
                      class="w-full rounded-xl bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 px-4 py-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-rosegold-500" />
                  </div>
                </div>
              </div>

              <!-- Instrucciones Transferencia -->
              <div id="transfer-instructions" class="hidden rounded-xl bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 p-4 text-xs leading-relaxed text-slate-650 dark:text-stone-350">
                <span class="block font-bold text-burgundy-850 dark:text-rosegold-400 mb-2">Instrucciones de Pago:</span>
                Realiza la transferencia por el valor de <strong>$${total.toLocaleString()}</strong> a la cuenta corriente Bancolombia No. <strong>987-654321-01</strong> a nombre de <strong>Atelier Modisteria S.A.S.</strong><br>
                Envía tu comprobante de pago adjuntando el ID de orden que se generará a continuación a: <strong>pagos@ateliermodisteria.com</strong>
              </div>

            </div>

            <!-- Confirmación final -->
            <div class="mt-4 pt-6 border-t border-stone-200 dark:border-stone-800">
              <button type="submit" class="w-full rounded-xl bg-burgundy-850 hover:bg-burgundy-600 py-4 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-center">
                💳 Completar Compra ($${total.toLocaleString()})
              </button>
            </div>

          </form>

        </div>

        <!-- Resumen de Pedido -->
        <div class="rounded-3xl bg-cream-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-8 shadow-sm">
          <h3 class="text-lg font-bold text-burgundy-850 dark:text-stone-100 font-serif mb-6 pb-4 border-b border-stone-200 dark:border-stone-850">Detalle de Compra</h3>
          
          <!-- Lista abreviada -->
          <div class="grid gap-4 max-h-72 overflow-y-auto mb-6 pr-2">
            ${carrito.map(item => {
              return `
              <div class="flex items-center gap-3 text-xs">
                <div class="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-stone-200 border border-stone-300 dark:border-stone-800">
                  <img src="${item.imagen}" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1 min-w-0">
                  <span class="block font-bold text-slate-800 dark:text-white truncate">${item.nombre}</span>
                  <span class="text-slate-400 text-[10px]">Talla: ${item.talla} / Cant: ${item.cantidad}</span>
                </div>
                <span class="font-bold text-slate-850 dark:text-stone-200 shrink-0">$${(item.precio * item.cantidad).toLocaleString()}</span>
              </div>
              `;
            }).join("")}
          </div>

          <div class="h-px bg-stone-200 dark:bg-stone-850 my-4"></div>

          <!-- Totales -->
          <div class="grid gap-3 text-xs text-slate-650 dark:text-stone-400">
            <div class="flex items-center justify-between">
              <span>Subtotal</span>
              <span class="font-bold text-slate-800 dark:text-white">$${subtotal.toLocaleString()}</span>
            </div>
            
            ${descuento > 0 ? `
            <div class="flex items-center justify-between text-green-600">
              <span>Descuento (${descPorcentaje}%)</span>
              <span class="font-bold">-$${descuento.toLocaleString()}</span>
            </div>
            ` : ""}

            <div class="flex items-center justify-between">
              <span>Envío</span>
              <span class="font-bold text-green-600">Gratuito</span>
            </div>

            <div class="h-px bg-stone-200 dark:bg-stone-850 my-2"></div>

            <div class="flex items-center justify-between text-sm font-bold text-burgundy-850 dark:text-rosegold-400 font-serif">
              <span>Monto Total</span>
              <span class="text-lg">$${total.toLocaleString()}</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  </main>

  ${renderFooter()}
  `;
}

export function setupCheckout() {
  setupNavbar();
  
  const form = document.getElementById("checkout-form");
  const cardFields = document.getElementById("card-fields");
  const transferInstructions = document.getElementById("transfer-instructions");
  const errorBox = document.getElementById("checkout-error");

  if (!form) return;

  // Toggle de métodos de pago
  document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
    radio.addEventListener("change", (e) => {
      if (e.target.value === "tarjeta") {
        cardFields.classList.remove("hidden");
        transferInstructions.classList.add("hidden");
        // Habilitar campos requeridos de tarjeta
        document.getElementById("card-number").setAttribute("required", "required");
        document.getElementById("card-expiry").setAttribute("required", "required");
        document.getElementById("card-cvv").setAttribute("required", "required");
      } else {
        cardFields.classList.add("hidden");
        transferInstructions.classList.remove("hidden");
        // Deshabilitar campos requeridos de tarjeta
        document.getElementById("card-number").removeAttribute("required");
        document.getElementById("card-expiry").removeAttribute("removeAttribute");
        document.getElementById("card-cvv").removeAttribute("required");
      }
    });
  });

  // Formateadores automáticos en vivo para tarjeta
  const cardNum = document.getElementById("card-number");
  cardNum?.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.match(/.{1,4}/g)?.join(" ") || value;
    e.target.value = value;
  });

  const cardExpiry = document.getElementById("card-expiry");
  cardExpiry?.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }
    e.target.value = value;
  });

  // Submit de orden
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const usuario = obtenerSesion();
    const carrito = obtenerCarrito();
    const subtotal = obtenerTotalCarrito();
    const descPorcentaje = parseInt(sessionStorage.getItem("descuentoPorcentaje") || "0");
    const descuento = subtotal * (descPorcentaje / 100);
    const total = subtotal - descuento;

    const address = document.getElementById("shipping-address").value.trim();
    const city = document.getElementById("shipping-city").value.trim();
    const phone = document.getElementById("shipping-phone").value.trim();
    const metodoPagoValue = document.querySelector('input[name="payment-method"]:checked').value;

    const metodosMapeo = {
      tarjeta: "Tarjeta de Crédito",
      transferencia: "Transferencia Bancaria"
    };

    // Crear objeto de orden
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
      estado: "Confirmada", // En el flujo del cliente, se confirma de una
      direccionEnvio: `${address}, ${city}`,
      telefono: phone,
      metodoPago: metodosMapeo[metodoPagoValue]
    };

    try {
      await crearOrden(orden);
      
      // Limpiar estados
      vaciarCarrito();
      sessionStorage.removeItem("descuentoPorcentaje");

      // Alertar y navegar a dashboard
      alert("¡Pedido realizado con éxito! Tu prenda empezará a confeccionarse de inmediato.");
      navigate("/dashboard");
    } catch (err) {
      errorBox.textContent = "No se pudo realizar el pedido debido a un error con la base de datos.";
      errorBox.classList.remove("hidden");
    }
  });
}
