import { renderNavbar, setupNavbar } from "../../components/navbar.js";
import { renderFooter } from "../../components/footer.js";
import { obtenerSesion, guardarSesion, BASE_URL } from "../../services/auth.service.js";
import { actualizarUsuario } from "../../services/user.service.js";
import { navigate } from "../../router/router.js";

export function renderProfile() {
  const usuario = obtenerSesion();

  return `
  ${renderNavbar()}

  <main class="min-h-screen bg-stone-50 dark:bg-stone-950 transition-colors py-12">
    <div class="mx-auto max-w-xl px-6">
      
      <!-- Botón de regreso -->
      <div class="mb-8">
        <a href="/dashboard" data-link class="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-stone-400 hover:text-rosegold-500 transition-colors">
          ⬅ Volver al Dashboard
        </a>
      </div>

      <!-- Ficha de Perfil -->
      <div class="bg-cream-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-850 rounded-3xl p-8 shadow-sm transition-colors">
        
        <span class="text-xs font-bold uppercase tracking-widest text-rosegold-500">Configuración</span>
        <h1 class="text-3xl font-bold text-burgundy-850 dark:text-stone-100 font-serif mt-2 mb-6">Mi Perfil</h1>

        <div id="profile-success" class="hidden mb-4 rounded-2xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50 px-4 py-3 text-sm text-green-700 dark:text-green-400"></div>
        <div id="profile-error" class="hidden mb-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 px-4 py-3 text-sm text-red-650 dark:text-red-400"></div>

        <form id="profile-form" class="grid gap-5">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400 mb-2" for="profile-name">Nombre</label>
              <input id="profile-name" type="text" value="${usuario.name}" required
                class="w-full rounded-xl bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 px-4 py-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-rosegold-500" />
            </div>
            
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400 mb-2" for="profile-lastname">Apellido</label>
              <input id="profile-lastname" type="text" value="${usuario.lastName}" required
                class="w-full rounded-xl bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 px-4 py-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-rosegold-500" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400 mb-2" for="profile-email">Correo Electrónico</label>
            <input id="profile-email" type="email" value="${usuario.email}" required
              class="w-full rounded-xl bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 px-4 py-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-rosegold-500" />
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400 mb-2" for="profile-password">Contraseña</label>
            <input id="profile-password" type="password" value="${usuario.password}" required minlength="6"
              class="w-full rounded-xl bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 px-4 py-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-rosegold-500" />
          </div>

          <button type="submit" class="w-full rounded-xl bg-burgundy-850 px-5 py-3.5 text-sm font-bold text-white hover:bg-burgundy-600 shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-center mt-4">
            Actualizar Perfil
          </button>
        </form>

      </div>
    </div>
  </main>

  ${renderFooter()}
  `;
}

export function setupProfile() {
  setupNavbar();

  const form = document.getElementById("profile-form");
  const successBox = document.getElementById("profile-success");
  const errorBox = document.getElementById("profile-error");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    successBox.classList.add("hidden");
    errorBox.classList.add("hidden");

    const usuarioActual = obtenerSesion();
    const name = document.getElementById("profile-name").value.trim();
    const lastName = document.getElementById("profile-lastname").value.trim();
    const email = document.getElementById("profile-email").value.trim();
    const password = document.getElementById("profile-password").value;

    try {
      // Check if email exists y no es el del propio usuario
      if (email !== usuarioActual.email) {
        const checkEmailRes = await fetch(`${BASE_URL}/users?email=${email}`);
        const existing = await checkEmailRes.json();
        if (existing.length > 0) {
          errorBox.textContent = "El correo electrónico especificado ya pertenece a otra cuenta.";
          errorBox.classList.remove("hidden");
          return;
        }
      }

      // Actualizar datos
      const datosActualizados = { name, lastName, email, password };
      const usuarioSalvado = await actualizarUsuario(usuarioActual.id, datosActualizados);
      
      // Guardar nueva sesión local
      // El API PATCH retorna el objeto con campos completos incluyendo rol
      const sesionNueva = {
        ...usuarioActual,
        ...usuarioSalvado
      };
      guardarSesion(sesionNueva);

      successBox.innerHTML = `<span class="flex items-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg> Tu perfil ha sido actualizado correctamente.</span>`;
      successBox.classList.remove("hidden");
    } catch (err) {
      errorBox.textContent = "Error de red: No se pudo conectar con el servidor.";
      errorBox.classList.remove("hidden");
    }
  });
}
