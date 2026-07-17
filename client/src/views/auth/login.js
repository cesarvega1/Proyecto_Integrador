import { loginUsuario, guardarSesion } from "../../services/auth.service.js";
import { navigate } from "../../router/router.js";

export function renderLogin() {
  return `
  <main class="flex min-h-screen items-center justify-center bg-stone-100 dark:bg-stone-950 px-4 py-16 transition-colors">
    <div class="w-full max-w-md rounded-3xl bg-cream-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-850 p-8 shadow-xl">
      <div class="flex items-center justify-between mb-8">
        <a class="text-xl font-bold text-burgundy-850 dark:text-rosegold-400 font-serif" href="/" data-link>SportZone</a>
        <a class="rounded-full border border-stone-300 dark:border-stone-700 px-4 py-1.5 text-xs font-semibold text-slate-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors" href="/register" data-link>Registrarse</a>
      </div>
      
      <span class="inline-block text-xs font-bold uppercase tracking-widest text-rosegold-500 mb-2">Ingreso Seguro</span>
      <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2 font-serif">Bienvenido de nuevo</h1>
      <p class="text-slate-500 dark:text-stone-400 text-sm mb-6">Accede para gestionar tus prendas, compras y perfil de costura.</p>

      <div id="login-error" class="hidden mb-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 px-4 py-3 text-sm text-red-650 dark:text-red-400"></div>

      <form id="login-form" class="grid gap-5">
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400 mb-2" for="email">Correo Electrónico</label>
          <input id="email" type="email" placeholder="ejemplo@correo.com" required
            class="w-full rounded-xl bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 px-4 py-3 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-rosegold-500 transition-colors text-sm" />
        </div>
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-stone-400 mb-2" for="password">Contraseña</label>
          <input id="password" type="password" placeholder="••••••••" required
            class="w-full rounded-xl bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-800 px-4 py-3 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-rosegold-500 transition-colors text-sm" />
        </div>
        <button type="submit" class="w-full rounded-xl bg-burgundy-850 px-5 py-3.5 text-sm font-bold text-white hover:bg-burgundy-600 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]" style="cursor: pointer;">
          Entrar al SportZone
        </button>
      </form>
      
      <p class="text-center text-sm text-slate-500 dark:text-stone-400 mt-6">
        ¿Aún no tienes una cuenta? 
        <a class="text-rosegold-500 font-semibold hover:underline" href="/register" data-link>Crea una aquí</a>
      </p>
    </div>
  </main>`;
}

export function setupLogin() {
  const form = document.getElementById("login-form");
  const errorBox = document.getElementById("login-error");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    
    try {
      const usuario = await loginUsuario(email, password);
      if (!usuario) {
        errorBox.textContent = "El correo electrónico o la contraseña son incorrectos.";
        errorBox.classList.remove("hidden");
        return;
      }
      guardarSesion(usuario);
      
      // Si el usuario es administrador, redirecciona al panel de admin; si no, al dashboard
      if (usuario.role.includes("ADMIN")) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      errorBox.textContent = "Error de red: No se pudo conectar con el servidor.";
      errorBox.classList.remove("hidden");
    }
  });
}
