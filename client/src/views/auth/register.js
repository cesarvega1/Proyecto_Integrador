import { registrarUsuario, guardarSesion, loginUsuario, BASE_URL } from "../../services/auth.service.js";
import { navigate } from "../../router/router.js";

export function renderRegister() {
  return `
  <main class="flex min-h-screen items-center justify-center bg-stone-100 dark:bg-stone-950 px-4 py-16 transition-colors">
    <div class="w-full max-w-lg rounded-3xl bg-cream-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-8 shadow-xl">
      <div class="flex items-center justify-between mb-8">
        <a class="text-xl font-bold text-burgundy-850 dark:text-rosegold-400 font-serif" href="/" data-link> SportZone</a>
        <a class="rounded-full border border-stone-300 dark:border-stone-700 px-4 py-1.5 text-xs font-semibold text-slate-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors" href="/login" data-link>Iniciar Sesión</a>
      </div>

      <span class="inline-block text-xs font-bold uppercase tracking-widest text-rosegold-500 mb-2">Creación de cuenta</span>
      <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2 font-serif">Únete al SportZone</h1>
      <p class="text-slate-500 dark:text-stone-400 text-sm mb-6">Disfruta de pedidos personalizados, historial de órdenes y acceso preferente a colecciones.</p>

      <div id="register-error" class="hidden mb-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 px-4 py-3 text-sm text-red-650 dark:text-red-400"></div>

      <form id="register-form" class="grid gap-5">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400 mb-2" for="name">Nombre</label>
            <input id="name" type="text" placeholder="Tu nombre" required
              class="w-full rounded-xl bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 px-4 py-3 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-rosegold-500 text-sm" />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400 mb-2" for="lastName">Apellido</label>
            <input id="lastName" type="text" placeholder="Tu apellido" required
              class="w-full rounded-xl bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 px-4 py-3 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-rosegold-500 text-sm" />
          </div>
        </div>
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400 mb-2" for="email">Correo Electrónico</label>
          <input id="email" type="email" placeholder="correo@gmail.com" required
            class="w-full rounded-xl bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 px-4 py-3 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-rosegold-500 text-sm" />
        </div>
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400 mb-2" for="password">Contraseña</label>
          <input id="password" type="password" placeholder="Mínimo 6 caracteres" required minlength="6"
            class="w-full rounded-xl bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 px-4 py-3 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-rosegold-500 text-sm" />
        </div>
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400 mb-2" for="confirmPassword">Confirmar Contraseña</label>
          <input id="confirmPassword" type="password" placeholder="Confirma tu contraseña" required
            class="w-full rounded-xl bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 px-4 py-3 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-rosegold-500 text-sm" />
        </div>
        <button type="submit" class="w-full rounded-xl bg-burgundy-850 px-5 py-3.5 text-sm font-bold text-white hover:bg-burgundy-600 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]" style="cursor: pointer;">
          Crear Cuenta y Registrarse
        </button>
      </form>
      
      <p class="text-center text-sm text-slate-500 dark:text-stone-400 mt-6">
        ¿Ya tienes cuenta? 
        <a class="text-rosegold-500 font-semibold hover:underline" href="/login" data-link>Inicia sesión aquí</a>
      </p>
    </div>
  </main>`;
}

export function setupRegister() {
  const form = document.getElementById("register-form");
  const errorBox = document.getElementById("register-error");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      errorBox.textContent = "Las contraseñas ingresadas no coinciden.";
      errorBox.classList.remove("hidden");
      return;
    }

    try {
      // Check if email exists
      const checkEmailRes = await fetch(`${BASE_URL}/users?email=${email}`);
      const existing = await checkEmailRes.json();
      if (existing.length > 0) {
        errorBox.textContent = "Este correo electrónico ya está registrado.";
        errorBox.classList.remove("hidden");
        return;
      }

      // Register user
      const usuario = { name, lastName, email, password };
      const registrado = await registrarUsuario(usuario);
      
      // Auto login
      guardarSesion(registrado);
      navigate("/dashboard");
    } catch (err) {
      errorBox.textContent = "No se pudo completar el registro debido a un error de red.";
      errorBox.classList.remove("hidden");
    }
  });
}
