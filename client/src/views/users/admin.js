import { renderNavbar, setupNavbar } from "../../components/navbar.js";
import { renderFooter } from "../../components/footer.js";
import { obtenerProductos, eliminarProducto } from "../../services/product.service.js";
import { obtenerOrdenes, actualizarEstadoOrden } from "../../services/order.service.js";
import { obtenerUsuarios, actualizarRolUsuario } from "../../services/user.service.js";
import { navigate } from "../../router/router.js";

// Estado de la pestaña activa local
let pestañaActiva = "kpis"; // "kpis", "productos", "ordenes", "usuarios"

export function renderAdmin() {
  return `
  ${renderNavbar()}

  <main class="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors py-12">
    <div class="mx-auto max-w-6xl px-6">
      
      <!-- Cabecera panel -->
      <div class="mb-10 text-center md:text-left">
        <span class="text-xs font-bold uppercase tracking-widest text-sport-500">Administración</span>
        <h1 class="text-4xl font-black uppercase text-zinc-900 dark:text-white font-display mt-2">Panel Administrativo</h1>
        <p class="text-slate-500 dark:text-stone-400 text-sm mt-1">Control de catálogo deportivo, órdenes y usuarios registrados.</p>
      </div>

      <!-- Navegación de Pestañas -->
      <div class="flex flex-wrap border-b border-zinc-200 dark:border-zinc-800 gap-4 mb-8">
        <button class="tab-btn px-5 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
          pestañaActiva === "kpis" ? "border-sport-500 text-sport-500" : "border-transparent text-slate-500 dark:text-stone-400 hover:text-slate-800"
        }" data-tab="kpis">📊 Métricas</button>
        
        <button class="tab-btn px-5 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
          pestañaActiva === "productos" ? "border-sport-500 text-sport-500" : "border-transparent text-slate-500 dark:text-stone-400 hover:text-slate-800"
        }" data-tab="productos">🏋️ Inventario</button>
        
        <button class="tab-btn px-5 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
          pestañaActiva === "ordenes" ? "border-sport-500 text-sport-500" : "border-transparent text-slate-500 dark:text-stone-400 hover:text-slate-800"
        }" data-tab="ordenes">📦 Pedidos</button>
        
        <button class="tab-btn px-5 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
          pestañaActiva === "usuarios" ? "border-sport-500 text-sport-500" : "border-transparent text-slate-500 dark:text-stone-400 hover:text-slate-800"
        }" data-tab="usuarios">👥 Cuentas</button>
      </div>

      <!-- Contenido de Pestaña -->
      <div id="admin-tab-content">
        <!-- Spinner -->
        <div class="py-24 flex flex-col items-center justify-center text-slate-400 gap-4">
          <div class="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-sport-500"></div>
          <p class="text-sm font-semibold text-zinc-500">Cargando panel...</p>
        </div>
      </div>

    </div>
  </main>

  ${renderFooter()}
  `;
}

// Carga y renderiza el contenido de la pestaña seleccionada
async function cargarPestaña() {
  const tabContent = document.getElementById("admin-tab-content");
  if (!tabContent) return;

  try {
    if (pestañaActiva === "kpis") {
      const productos = await obtenerProductos();
      const ordenes = await obtenerOrdenes();
      const usuarios = await obtenerUsuarios();

      // Métricas clave
      const totalVentas = ordenes.reduce((acc, o) => acc + o.total, 0);
      const prendasStock = productos.reduce((acc, p) => acc + p.stock, 0);

      tabContent.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <span class="text-2xl">💰</span>
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-stone-400 mt-4">Ventas Brutas</h3>
          <p class="text-3xl font-extrabold text-sport-500 dark:text-sport-400 font-display mt-2">$${totalVentas.toLocaleString()}</p>
        </div>
        <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <span class="text-2xl">📦</span>
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-stone-400 mt-4">Pedidos Recibidos</h3>
          <p class="text-3xl font-extrabold text-sport-500 dark:text-sport-400 font-display mt-2">${ordenes.length}</p>
        </div>
        <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <span class="text-2xl">🏋️</span>
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-stone-400 mt-4">Stock en Inventario</h3>
          <p class="text-3xl font-extrabold text-sport-500 dark:text-sport-400 font-display mt-2">${prendasStock} uds.</p>
        </div>
        <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <span class="text-2xl">👤</span>
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-stone-400 mt-4">Clientes Registrados</h3>
          <p class="text-3xl font-extrabold text-sport-500 dark:text-sport-400 font-display mt-2">${usuarios.length}</p>
        </div>
      </div>

      <!-- Resumen gráfico / analítico simple -->
      <div class="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
        <h3 class="text-lg font-black uppercase text-zinc-900 dark:text-white font-display mb-4">Información del Sistema</h3>
        <p class="text-sm text-slate-500 dark:text-stone-400 leading-relaxed">
          Este panel interactúa directamente con la simulación del API en <code>json-server</code>. Las compras de los usuarios restan stock de forma automatizada y actualizan las métricas. Utilice las pestañas superiores para administrar el inventario deportivo de SportZone.
        </p>
      </div>
      `;
    } 
    
    else if (pestañaActiva === "productos") {
      const productos = await obtenerProductos();

      tabContent.innerHTML = `
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-black uppercase text-zinc-900 dark:text-white font-display">Inventario Deportivo</h2>
        <button id="add-product-btn" class="rounded-full bg-sport-500 hover:bg-sport-600 px-5 py-2 text-xs font-bold text-white transition-all cursor-pointer">
          ⚡ Registrar Producto
        </button>
      </div>

      <div class="overflow-x-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
        <table class="w-full text-left text-sm">
          <thead class="bg-zinc-100 dark:bg-zinc-950 text-xs font-bold uppercase text-slate-500 dark:text-stone-400 border-b border-zinc-200 dark:border-zinc-800">
            <tr>
              <th class="px-6 py-4">Producto</th>
              <th class="px-6 py-4">Categoría</th>
              <th class="px-6 py-4">Precio</th>
              <th class="px-6 py-4">Stock</th>
              <th class="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-200 dark:divide-zinc-800">
            ${productos.map(p => {
              return `
              <tr>
                <td class="px-6 py-4 flex items-center gap-3">
                  <img src="${p.imagen}" class="w-10 h-10 rounded-lg object-cover shrink-0 bg-zinc-200" />
                  <span class="font-bold text-slate-800 dark:text-white">${p.nombre}</span>
                </td>
                <td class="px-6 py-4 text-slate-600 dark:text-stone-300">${p.categoria}</td>
                <td class="px-6 py-4 font-bold text-sport-500 dark:text-sport-400">$${p.precio.toLocaleString()}</td>
                <td class="px-6 py-4 text-slate-600 dark:text-stone-300">${p.stock} u.</td>
                <td class="px-6 py-4 text-right flex items-center justify-end gap-3 mt-1.5">
                  <button class="edit-prod-btn text-xs font-bold text-blue-600 hover:underline cursor-pointer" data-id="${p.id}">Editar</button>
                  <button class="delete-prod-btn text-xs font-bold text-red-500 hover:underline cursor-pointer" data-id="${p.id}">Eliminar</button>
                </td>
              </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
      `;

      // Evento Agregar Producto
      document.getElementById("add-product-btn")?.addEventListener("click", () => {
        sessionStorage.removeItem("editProductoId");
        navigate("/admin-producto-form");
      });

      // Evento Editar Producto
      document.querySelectorAll(".edit-prod-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const id = btn.getAttribute("data-id");
          sessionStorage.setItem("editProductoId", id);
          navigate("/admin-producto-form");
        });
      });

      // Evento Eliminar Producto
      document.querySelectorAll(".delete-prod-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
          const id = btn.getAttribute("data-id");
          if (confirm("¿Estás seguro de que deseas eliminar este producto permanentemente?")) {
            try {
              await eliminarProducto(id);
              cargarPestaña();
            } catch (err) {
              alert("Error al eliminar el producto.");
            }
          }
        });
      });
    } 
    
    else if (pestañaActiva === "ordenes") {
      const ordenes = await obtenerOrdenes();
      const usuarios = await obtenerUsuarios();

      tabContent.innerHTML = `
      <h2 class="text-xl font-black uppercase text-zinc-900 dark:text-white font-display mb-6">Registro de Pedidos Recibidos</h2>

      <div class="overflow-x-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
        <table class="w-full text-left text-sm">
          <thead class="bg-zinc-100 dark:bg-zinc-950 text-xs font-bold uppercase text-slate-500 dark:text-stone-400 border-b border-zinc-200 dark:border-zinc-800">
            <tr>
              <th class="px-6 py-4">Orden ID</th>
              <th class="px-6 py-4">Cliente</th>
              <th class="px-6 py-4">Fecha</th>
              <th class="px-6 py-4">Total</th>
              <th class="px-6 py-4">Estado</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-200 dark:divide-stone-850">
            ${ordenes.reverse().map(o => {
              const clienteObj = usuarios.find(u => u.id === o.userId);
              const clienteNombre = clienteObj ? `${clienteObj.name} ${clienteObj.lastName}` : `Usuario #${o.userId}`;

              return `
              <tr>
                <td class="px-6 py-4 text-xs font-bold text-slate-400">#${o.id}</td>
                <td class="px-6 py-4 font-bold text-slate-800 dark:text-white">${clienteNombre}</td>
                <td class="px-6 py-4 text-slate-650 dark:text-stone-350">${o.fecha}</td>
                <td class="px-6 py-4 font-bold text-burgundy-850 dark:text-rosegold-400">$${o.total.toLocaleString()}</td>
                <td class="px-6 py-4">
                  <select class="status-select rounded-lg border border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-950 px-2 py-1 text-xs font-semibold focus:outline-none focus:border-rosegold-500 transition-colors"
                    data-id="${o.id}">
                    <option value="Confirmada" ${o.estado === "Confirmada" ? "selected" : ""}>Confirmada</option>
                    <option value="En preparación" ${o.estado === "En preparación" ? "selected" : ""}>En preparación</option>
                    <option value="Enviado" ${o.estado === "Enviado" ? "selected" : ""}>Enviado</option>
                    <option value="Entregado" ${o.estado === "Entregado" ? "selected" : ""}>Entregado</option>
                    <option value="Cancelado" ${o.estado === "Cancelado" ? "selected" : ""}>Cancelado</option>
                  </select>
                </td>
              </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
      `;

      // Escuchar cambios de estado en vivo
      document.querySelectorAll(".status-select").forEach(select => {
        select.addEventListener("change", async (e) => {
          const id = select.getAttribute("data-id");
          const nuevoEstado = e.target.value;
          try {
            await actualizarEstadoOrden(id, nuevoEstado);
          } catch (err) {
            alert("No se pudo actualizar el estado del pedido.");
          }
        });
      });
    } 
    
    else if (pestañaActiva === "usuarios") {
      const usuarios = await obtenerUsuarios();

      tabContent.innerHTML = `
      <h2 class="text-xl font-bold text-burgundy-850 dark:text-stone-100 font-serif mb-6">Gestión de Cuentas</h2>

      <div class="overflow-x-auto bg-cream-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-850 rounded-2xl">
        <table class="w-full text-left text-sm">
          <thead class="bg-stone-100 dark:bg-stone-950 text-xs font-bold uppercase text-slate-500 dark:text-stone-400 border-b border-stone-200 dark:border-stone-850">
            <tr>
              <th class="px-6 py-4">Usuario ID</th>
              <th class="px-6 py-4">Nombre Completo</th>
              <th class="px-6 py-4">Correo</th>
              <th class="px-6 py-4">Rol</th>
              <th class="px-6 py-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-200 dark:divide-stone-850">
            ${usuarios.map(u => {
              const isAdmin = u.role.includes("ADMIN");
              
              return `
              <tr>
                <td class="px-6 py-4 text-xs text-slate-400">#${u.id}</td>
                <td class="px-6 py-4 font-bold text-slate-800 dark:text-white">${u.name} ${u.lastName}</td>
                <td class="px-6 py-4 text-slate-650 dark:text-stone-350">${u.email}</td>
                <td class="px-6 py-4">
                  <span class="rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                    isAdmin ? "bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-400" : "bg-stone-100 text-stone-750 dark:bg-stone-800 dark:text-stone-350"
                  }">
                    ${u.role.join(", ")}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <button class="toggle-role-btn text-xs font-bold text-rosegold-500 hover:underline cursor-pointer" 
                    data-id="${u.id}" data-role="${isAdmin ? "USER" : "ADMIN"}">
                    Hacer ${isAdmin ? "Cliente" : "Administrador"}
                  </button>
                </td>
              </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
      `;

      // Cambiar rol de usuario en vivo
      document.querySelectorAll(".toggle-role-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
          const id = btn.getAttribute("data-id");
          const targetRole = btn.getAttribute("data-role");
          const confirmMsg = `¿Estás seguro de cambiar el rol de este usuario a ${targetRole}?`;

          // Validar que el administrador no se quite el rol a sí mismo
          const actualSession = JSON.parse(localStorage.getItem("usuario"));
          if (parseInt(id) === actualSession.id) {
            alert("No puedes retirarte los privilegios de administrador a ti mismo.");
            return;
          }

          if (confirm(confirmMsg)) {
            try {
              await actualizarRolUsuario(id, [targetRole]);
              cargarPestaña();
            } catch (err) {
              alert("Error al actualizar el rol del usuario.");
            }
          }
        });
      });
    }

  } catch (err) {
    tabContent.innerHTML = `
    <div class="py-12 text-center text-red-500 bg-cream-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-850 rounded-3xl">
      <span class="text-5xl">⚠️</span>
      <h3 class="text-lg font-bold mt-4 font-serif">Error de carga</h3>
      <p class="text-sm text-stone-500 mt-2">No se pudo recuperar la información del servidor API.</p>
    </div>
    `;
  }
}

export function setupAdmin() {
  setupNavbar();

  // Escuchar clics en los botones de pestañas
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      // Quitar clases activas de todos
      document.querySelectorAll(".tab-btn").forEach(b => {
        b.classList.remove("border-rosegold-500", "text-burgundy-850", "dark:text-rosegold-400");
        b.classList.add("border-transparent", "text-slate-500", "dark:text-stone-400");
      });

      // Añadir clases activas al presionado
      btn.classList.add("border-rosegold-500", "text-burgundy-850", "dark:text-rosegold-400");
      btn.classList.remove("border-transparent", "text-slate-500", "dark:text-stone-400");

      pestañaActiva = btn.getAttribute("data-tab");
      cargarPestaña();
    });
  });

  // Carga inicial
  cargarPestaña();
}
