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
    return isDark ? "🌙" : "☀️";
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
        if (iconSpan) iconSpan.textContent = isDark ? "🌙" : "☀️";
    });
}
