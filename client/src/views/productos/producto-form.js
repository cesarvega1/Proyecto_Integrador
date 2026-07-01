import { renderNavbar, setupNavbar } from "../../components/navbar.js";
import { renderFooter } from "../../components/footer.js";
import { obtenerProductoPorId, crearProducto, actualizarProducto } from "../../services/product.service.js";
import { navigate } from "../../router/router.js";

export function renderProductoForm() {
  const editId = sessionStorage.getItem("editProductoId");
  const esEdicion = editId !== null;

  return `
  ${renderNavbar()}

  <main class="min-h-screen bg-stone-50 dark:bg-stone-950 transition-colors py-12">
    <div class="mx-auto max-w-xl px-6">
      
      <!-- Regreso -->
      <div class="mb-8">
        <a href="/admin" data-link class="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-stone-400 hover:text-rosegold-500 transition-colors">
          ⬅ Volver al Panel Admin
        </a>
      </div>

      <!-- Ficha de Formulario -->
      <div class="bg-cream-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-850 rounded-3xl p-8 shadow-sm transition-colors">
        
        <span class="text-xs font-bold uppercase tracking-widest text-rosegold-500">
          ${esEdicion ? "Modificación de Prenda" : "Registro de Catálogo"}
        </span>
        <h1 id="form-title" class="text-3xl font-bold text-burgundy-850 dark:text-stone-100 font-serif mt-2 mb-6">
          ${esEdicion ? "Editar Prenda" : "Registrar Nueva Prenda"}
        </h1>

        <div id="form-error" class="hidden mb-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 px-4 py-3 text-sm text-red-650 dark:text-red-400"></div>

        <form id="product-form" class="grid gap-5">
          
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400 mb-2" for="prod-name">Nombre de la Prenda</label>
            <input id="prod-name" type="text" placeholder="Ej. Vestido Silk Imperial" required
              class="w-full rounded-xl bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 px-4 py-3 text-sm text-slate-850 dark:text-white focus:outline-none focus:border-rosegold-500" />
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400 mb-2" for="prod-desc">Descripción</label>
            <textarea id="prod-desc" rows="3" placeholder="Detalles de costura, caída de tela..." required
              class="w-full rounded-xl bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 px-4 py-3 text-sm text-slate-850 dark:text-white focus:outline-none focus:border-rosegold-500"></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400 mb-2" for="prod-cat">Categoría</label>
              <select id="prod-cat" required
                class="w-full rounded-xl bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 px-4 py-3 text-sm text-slate-850 dark:text-white focus:outline-none focus:border-rosegold-500">
                <option value="Vestidos">Vestidos</option>
                <option value="Trajes">Trajes</option>
                <option value="Blusas">Blusas</option>
                <option value="Faldas">Faldas</option>
                <option value="Sacos">Sacos</option>
                <option value="Accesorios">Accesorios</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400 mb-2" for="prod-price">Precio ($)</label>
              <input id="prod-price" type="number" min="0" placeholder="250000" required
                class="w-full rounded-xl bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 px-4 py-3 text-sm text-slate-850 dark:text-white focus:outline-none focus:border-rosegold-500" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400 mb-2" for="prod-stock">Stock Inicial</label>
              <input id="prod-stock" type="number" min="0" placeholder="10" required
                class="w-full rounded-xl bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 px-4 py-3 text-sm text-slate-850 dark:text-white focus:outline-none focus:border-rosegold-500" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400 mb-2" for="prod-image">URL de Imagen</label>
              <input id="prod-image" type="url" placeholder="https://unsplash.com/..." required
                class="w-full rounded-xl bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 px-4 py-3 text-sm text-slate-850 dark:text-white focus:outline-none focus:border-rosegold-500" />
            </div>
          </div>

          <!-- Selección de Tallas (Checkboxes) -->
          <div>
            <span class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400 mb-2">Tallas Disponibles</span>
            <div class="flex gap-4">
              ${["XS", "S", "M", "L", "XL"].map(sz => {
                return `
                <label class="flex items-center gap-1.5 text-sm cursor-pointer text-slate-750 dark:text-stone-350">
                  <input type="checkbox" name="prod-tallas" value="${sz}" checked class="accent-rosegold-500" />
                  <span>${sz}</span>
                </label>
                `;
              }).join("")}
            </div>
          </div>

          <!-- Input de Colores Coma Separados -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400 mb-2" for="prod-colors">Colores (Separados por coma)</label>
            <input id="prod-colors" type="text" placeholder="Borgoña, Negro, Gris Oxford, Crema" required
              class="w-full rounded-xl bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 px-4 py-3 text-sm text-slate-850 dark:text-white focus:outline-none focus:border-rosegold-500" />
            <span class="block text-[10px] text-slate-400 mt-1">Ingresa los nombres de colores legibles para el cliente.</span>
          </div>

          <button type="submit" class="w-full rounded-xl bg-burgundy-850 px-5 py-3.5 text-sm font-bold text-white hover:bg-burgundy-600 shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-center mt-4">
            ${esEdicion ? "Guardar Cambios" : "Registrar Prenda"}
          </button>
        </form>

      </div>
    </div>
  </main>

  ${renderFooter()}
  `;
}

export async function setupProductoForm() {
  setupNavbar();

  const form = document.getElementById("product-form");
  const errorBox = document.getElementById("form-error");
  const editId = sessionStorage.getItem("editProductoId");
  const esEdicion = editId !== null;

  if (!form) return;

  // Si es edición, cargamos los datos del producto
  if (esEdicion) {
    try {
      const p = await obtenerProductoPorId(editId);
      document.getElementById("prod-name").value = p.nombre;
      document.getElementById("prod-desc").value = p.descripcion;
      document.getElementById("prod-cat").value = p.categoria;
      document.getElementById("prod-price").value = p.precio;
      document.getElementById("prod-stock").value = p.stock;
      document.getElementById("prod-image").value = p.imagen;
      document.getElementById("prod-colors").value = p.colores.join(", ");
      
      // Marcar checkboxes correspondientes
      document.querySelectorAll('input[name="prod-tallas"]').forEach(box => {
        box.checked = p.tallas.includes(box.value);
      });
    } catch (err) {
      errorBox.textContent = "Error al precargar los datos de la prenda.";
      errorBox.classList.remove("hidden");
    }
  }

  // Submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorBox.classList.add("hidden");

    const nombre = document.getElementById("prod-name").value.trim();
    const descripcion = document.getElementById("prod-desc").value.trim();
    const categoria = document.getElementById("prod-cat").value;
    const precio = parseInt(document.getElementById("prod-price").value);
    const stock = parseInt(document.getElementById("prod-stock").value);
    const imagen = document.getElementById("prod-image").value.trim();
    
    // Obtener colores
    const colores = document.getElementById("prod-colors").value
      .split(",")
      .map(x => x.trim())
      .filter(x => x.length > 0);

    // Obtener tallas marcadas
    const tallas = [];
    document.querySelectorAll('input[name="prod-tallas"]:checked').forEach(box => {
      tallas.push(box.value);
    });

    if (tallas.length === 0) {
      errorBox.textContent = "Debes seleccionar al menos una talla disponible.";
      errorBox.classList.remove("hidden");
      return;
    }

    const payload = {
      nombre,
      descripcion,
      categoria,
      precio,
      stock,
      tallas,
      colores,
      imagen
    };

    try {
      if (esEdicion) {
        await actualizarProducto(editId, payload);
        sessionStorage.removeItem("editProductoId");
      } else {
        // En json-server, si creamos un nuevo item, debemos asignar un ID aleatorio o que json-server lo asigne
        // json-server lo auto-incrementa si omitimos el id.
        await crearProducto(payload);
      }
      navigate("/admin");
    } catch (err) {
      errorBox.textContent = "Error de red: No se pudo guardar la prenda.";
      errorBox.classList.remove("hidden");
    }
  });
}
