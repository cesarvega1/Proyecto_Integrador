import { renderNavbar, setupNavbar } from "../../components/navbar.js";
import { renderFooter } from "../../components/footer.js";
import { obtenerSesion } from "../../services/auth.service.js";
import { obtenerOrdenesPorUsuario } from "../../services/order.service.js";

export function renderDashboard() {
  const usuario = obtenerSesion();

  return `
  ${renderNavbar()}

  <main class="min-h-screen bg-stone-50 dark:bg-stone-950 transition-colors py-12">
    <div class="mx-auto max-w-5xl px-6">
      
      <!-- Encabezado Perfil -->
      <div class="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
        <div>
          <span class="text-xs font-bold uppercase tracking-widest text-rosegold-500">Mi Cuenta</span>
          <h1 class="text-4xl font-bold text-burgundy-850 dark:text-rosegold-400 font-serif mt-2">
            Hola, ${usuario.name} ${usuario.lastName}
          </h1>
          <p class="text-slate-500 dark:text-stone-400 text-sm mt-1">Bienvenido a tu panel de costura y pedidos.</p>
        </div>
        <a class="rounded-xl border border-stone-300 dark:border-stone-800 hover:border-rosegold-500 px-5 py-2.5 text-xs font-bold text-slate-700 dark:text-stone-300 hover:bg-stone-150 transition-all cursor-pointer"
           href="/profile" data-link>Editar Perfil</a>
      </div>

      <!-- Tarjetas de Métricas -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div class="bg-cream-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-850 rounded-2xl p-6 shadow-sm">
          <span class="text-2xl">📦</span>
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-450 dark:text-stone-400 mt-4">Total Pedidos</h3>
          <p id="stat-orders-count" class="text-3xl font-extrabold text-burgundy-850 dark:text-rosegold-400 font-serif mt-2">0</p>
        </div>
        <div class="bg-cream-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-850 rounded-2xl p-6 shadow-sm">
          <span class="text-2xl">💳</span>
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-450 dark:text-stone-400 mt-4">Monto Invertido</h3>
          <p id="stat-total-spent" class="text-3xl font-extrabold text-burgundy-850 dark:text-rosegold-400 font-serif mt-2">$0</p>
        </div>
        <div class="bg-cream-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-850 rounded-2xl p-6 shadow-sm">
          <span class="text-2xl">🪡</span>
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-450 dark:text-stone-400 mt-4">Estado del SportZone</h3>
          <p class="text-sm font-semibold text-green-600 mt-3 flex items-center gap-1.5">
            <span class="h-2.5 w-2.5 rounded-full bg-green-500 inline-block animate-pulse"></span> Activo y Recibiendo Pedidos
          </p>
        </div>
      </div>

      <!-- Listado de Órdenes -->
      <div>
        <h2 class="text-2xl font-bold text-burgundy-850 dark:text-stone-100 font-serif mb-6">Historial de Pedidos</h2>
        <div id="orders-list-container" class="grid gap-6">
          
          <!-- Spinner de Carga -->
          <div class="py-12 flex flex-col items-center justify-center text-slate-400 gap-4">
            <div class="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-burgundy-850"></div>
            <p class="text-sm font-semibold text-stone-500 font-serif">Consultando registro de agujas...</p>
          </div>

        </div>
      </div>

    </div>
  </main>

  ${renderFooter()}
  `;
}

export async function setupDashboard() {
  setupNavbar();

  const usuario = obtenerSesion();
  const listContainer = document.getElementById("orders-list-container");
  if (!listContainer) return;

  try {
    const ordenes = await obtenerOrdenesPorUsuario(usuario.id);

    // Calcular estadísticas
    const statOrdersCount = document.getElementById("stat-orders-count");
    const statTotalSpent = document.getElementById("stat-total-spent");
    
    if (statOrdersCount) statOrdersCount.textContent = ordenes.length;
    if (statTotalSpent) {
      const sum = ordenes.reduce((acc, o) => acc + o.total, 0);
      statTotalSpent.textContent = `$${sum.toLocaleString()}`;
    }

    if (ordenes.length === 0) {
      listContainer.innerHTML = `
      <div class="py-12 text-center text-slate-400 bg-cream-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-850 rounded-3xl">
        <span class="text-5xl">👔</span>
        <h3 class="text-lg font-bold text-slate-800 dark:text-white mt-4 font-serif">No tienes pedidos registrados</h3>
        <p class="text-sm text-stone-500 mt-2">Visita nuestra colección y realiza tu primer pedido de modistería a medida.</p>
        <div class="mt-6">
          <a class="rounded-full bg-burgundy-850 hover:bg-burgundy-600 px-6 py-2.5 text-xs font-bold text-white transition-all inline-block"
             href="/productos" data-link>Explorar catálogo</a>
        </div>
      </div>
      `;
      return;
    }

    // Renderizar listado de ordenes
    listContainer.innerHTML = ordenes.reverse().map(o => {
      // Color del badge de estado
      let colorClass = "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300";
      if (o.estado === "Confirmada") colorClass = "bg-blue-100 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400";
      if (o.estado === "En preparación") colorClass = "bg-purple-100 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400";
      if (o.estado === "Enviado") colorClass = "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400";
      if (o.estado === "Entregado") colorClass = "bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-400";
      if (o.estado === "Cancelado") colorClass = "bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-400";

      return `
      <div class="bg-cream-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-850 rounded-3xl p-6 shadow-sm transition-colors">
        
        <!-- Cabecera de la Orden -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
          <div>
            <span class="text-xs text-slate-400">Orden ID: <strong>#${o.id}</strong></span>
            <span class="block text-xs text-slate-400 mt-0.5">Fecha de Compra: <strong>${o.fecha}</strong></span>
          </div>
          <span class="rounded-full px-3.5 py-1 text-[10px] font-black uppercase tracking-wider ${colorClass}">
            ${o.estado}
          </span>
        </div>

        <!-- Lista de prendas de esta orden -->
        <div class="py-6 grid gap-4">
          ${o.productos.map(p => {
            return `
            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center gap-2">
                <span class="text-lg">👚</span>
                <div>
                  <span class="font-bold text-slate-800 dark:text-white">${p.nombre}</span>
                  <span class="block text-[10px] text-slate-400">Talla: ${p.talla} | Color: ${p.color} | Cantidad: ${p.cantidad}</span>
                </div>
              </div>
              <span class="font-bold text-burgundy-850 dark:text-rosegold-400 font-serif">$${(p.precioUnitario * p.cantidad).toLocaleString()}</span>
            </div>
            `;
          }).join("")}
        </div>

        <!-- Pie de la Orden -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-stone-200 dark:border-stone-800 text-xs text-slate-500 dark:text-stone-400">
          <div>
            <span>Dirección: <strong>${o.direccionEnvio}</strong></span>
            <span class="block mt-0.5">Medio de Pago: <strong>${o.metodoPago}</strong></span>
          </div>
          <div class="text-right w-full sm:w-auto">
            <span class="text-[10px] uppercase font-bold tracking-wider block">Total Pagado</span>
            <span class="text-base font-extrabold text-burgundy-850 dark:text-rosegold-400 font-serif">$${o.total.toLocaleString()}</span>
          </div>
        </div>

      </div>
      `;
    }).join("");

  } catch (err) {
    listContainer.innerHTML = `
    <div class="py-12 text-center text-red-500 bg-cream-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-850 rounded-3xl">
      <span class="text-5xl">⚠️</span>
      <h3 class="text-lg font-bold mt-4 font-serif">Error al consultar pedidos</h3>
      <p class="text-sm text-stone-500 mt-2">Por favor, valida que el servidor API se encuentre en ejecución.</p>
    </div>
    `;
  }
}
