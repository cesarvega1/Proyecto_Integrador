export function initTheme() {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const isDark = savedTheme === "dark" || (!savedTheme && prefersDark);

    if (isDark) {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }
}

export function toggleTheme() {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    return isDark;
}

export function getThemeIcon() {
    const isDark = document.documentElement.classList.contains("dark");
    return isDark 
      ? '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>'
      : '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>';
}

export function renderThemeToggle() {
    return `
    <button id="theme-toggle" class="flex items-center justify-center w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-900 text-stone-850 dark:text-stone-100 hover:bg-stone-200 dark:hover:bg-stone-800 transition-all border border-stone-200 dark:border-stone-800 shadow-sm" aria-label="Cambiar Tema" style="cursor: pointer;">
      <span id="theme-icon">${getThemeIcon()}</span>
    </button>
  `;
}


export function setupThemeToggle() {
    const btn = document.getElementById("theme-toggle");
    const icon = document.getElementById("theme-icon");
    if (!btn || !icon) {
        console.warn("Theme toggle button not found in DOM");
        return;
    }

    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    newBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const isDark = toggleTheme();
        const iconSpan = newBtn.querySelector("#theme-icon");
        if (iconSpan) {
            iconSpan.innerHTML = isDark 
              ? '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>'
              : '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>';
        }
    });
}
