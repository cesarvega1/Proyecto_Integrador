import { obtenerProductos } from "../services/product.service.js";
import { agregarAlCarrito, vaciarCarrito } from "../utils/cart.js";
import { navigate } from "../router/router.js";

// A1 Comment: Global assistant variable
let assistantActive = false;
let recognition = null;
let synth = window.speechSynthesis;
let voiceWavesInterval = null;
let voiceOutputText = "";
let isListening = false;

// A1 Comment: Voice commands config
const commandsList = [
  { keywords: ["ayuda", "help", "instrucciones"], desc: "Ver comandos de ayuda" },
  { keywords: ["buscar", "search", "encuentra"], desc: "Buscar prendas (ej. 'buscar calzado')" },
  { keywords: ["añadir", "agregar", "add", "compra"], desc: "Añadir prendas al carrito (ej. 'añadir camiseta')" },
  { keywords: ["vaciar", "limpiar", "clear"], desc: "Vaciar el carrito de compras" },
  { keywords: ["carrito", "cart", "ver carrito"], desc: "Ir a la vista del carrito" },
  { keywords: ["inicio", "home", "portada"], desc: "Ir a la página principal" },
  { keywords: ["catálogo", "catalogo", "productos"], desc: "Ir a la tienda de productos" }
];

// A1 Comment: Render helper for assistant HTML
export function initVoiceAssistant() {
  // A1 Comment: Do not add duplicate assistant
  if (document.getElementById("voice-assistant-root")) return;

  const root = document.createElement("div");
  root.id = "voice-assistant-root";
  root.className = "fixed bottom-6 right-6 z-50 font-sans";
  
  root.innerHTML = `
    <!-- A1 Comment: Floating button orb -->
    <button id="va-trigger" class="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-sport-600 to-sport-400 text-white shadow-lg shadow-sport-500/30 hover:scale-110 active:scale-95 transition-all cursor-pointer relative group">
      <span class="absolute inset-0 rounded-full bg-sport-500 animate-ping opacity-25 group-hover:opacity-40"></span>
      <svg id="va-mic-icon" class="w-6 h-6 z-10" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"></path>
      </svg>
    </button>

    <!-- A1 Comment: Chat panel -->
    <div id="va-panel" class="hidden absolute bottom-18 right-0 w-80 sm:w-96 rounded-3xl bg-zinc-950/95 border border-zinc-800 text-white shadow-2xl backdrop-blur-md overflow-hidden transition-all duration-300 flex flex-col">
      <!-- A1 Comment: Header -->
      <div class="px-5 py-4 border-b border-zinc-800 flex items-center justify-between bg-gradient-to-r from-sport-950/40 to-transparent">
        <div class="flex items-center gap-2.5">
          <span class="relative flex h-2.5 w-2.5">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sport-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-sport-500"></span>
          </span>
          <span class="text-xs font-black uppercase tracking-wider font-display text-zinc-100">AI Voice Assistant</span>
        </div>
        <button id="va-close" class="text-zinc-400 hover:text-white transition-colors cursor-pointer text-xs uppercase font-bold tracking-wider">Close</button>
      </div>

      <!-- A1 Comment: Visual wave section -->
      <div class="h-28 bg-zinc-950 flex flex-col items-center justify-center relative overflow-hidden border-b border-zinc-900/50">
        <canvas id="va-wave-canvas" class="w-full h-20 absolute inset-x-0 bottom-0"></canvas>
        <p id="va-status" class="text-xs text-zinc-400 font-medium tracking-wide z-10 animate-pulse">Click mic and speak</p>
      </div>

      <!-- A1 Comment: Conversation logs -->
      <div id="va-logs" class="flex-1 max-h-56 overflow-y-auto p-4 space-y-3 scrollbar-thin">
        <div class="bg-zinc-900/60 rounded-2xl p-3 border border-zinc-800 text-xs leading-relaxed text-zinc-300">
          <strong>AI:</strong> Hello! I am your Shopping Assistant. Speak or type a command.
          <div class="mt-2 text-[10px] text-sport-400 font-bold uppercase tracking-wider">Try saying: "buscar calzado" or "añadir camiseta"</div>
        </div>
      </div>

      <!-- A1 Comment: Quick actions pills -->
      <div class="px-4 py-2 bg-zinc-900/30 flex flex-wrap gap-1.5 border-t border-zinc-900/60">
        <button class="va-quick-btn text-[10px] font-bold uppercase bg-zinc-900 hover:bg-sport-950/40 border border-zinc-800 hover:border-sport-500 px-2.5 py-1 rounded-full transition-colors cursor-pointer text-zinc-300 hover:text-white" data-cmd="ayuda">💡 Ayuda</button>
        <button class="va-quick-btn text-[10px] font-bold uppercase bg-zinc-900 hover:bg-sport-950/40 border border-zinc-800 hover:border-sport-500 px-2.5 py-1 rounded-full transition-colors cursor-pointer text-zinc-300 hover:text-white" data-cmd="buscar camisetas">👕 Camisetas</button>
        <button class="va-quick-btn text-[10px] font-bold uppercase bg-zinc-900 hover:bg-sport-950/40 border border-zinc-800 hover:border-sport-500 px-2.5 py-1 rounded-full transition-colors cursor-pointer text-zinc-300 hover:text-white" data-cmd="buscar calzado">👟 Calzado</button>
        <button class="va-quick-btn text-[10px] font-bold uppercase bg-zinc-900 hover:bg-sport-950/40 border border-zinc-800 hover:border-sport-500 px-2.5 py-1 rounded-full transition-colors cursor-pointer text-zinc-300 hover:text-white" data-cmd="ver carrito">🛒 Carrito</button>
      </div>

      <!-- A1 Comment: Text input box -->
      <div class="p-3 border-t border-zinc-800 bg-zinc-900/50 flex gap-2">
        <input id="va-input" type="text" placeholder="Type command..." class="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-sport-500 transition-colors" />
        <button id="va-send" class="bg-sport-500 hover:bg-sport-600 px-3.5 py-2 rounded-xl text-xs font-black uppercase transition-colors cursor-pointer">Send</button>
      </div>
    </div>
  `;

  document.body.appendChild(root);
  setupVoiceEvents();
  initSpeechSupport();
  drawWaveform();
}

// A1 Comment: Setup interaction events
function setupVoiceEvents() {
  const trigger = document.getElementById("va-trigger");
  const panel = document.getElementById("va-panel");
  const closeBtn = document.getElementById("va-close");
  const sendBtn = document.getElementById("va-send");
  const inputEl = document.getElementById("va-input");

  // A1 Comment: Toggle assistant panel
  trigger?.addEventListener("click", () => {
    panel?.classList.toggle("hidden");
    if (!panel?.classList.contains("hidden")) {
      inputEl?.focus();
      if (!isListening) {
        startListening();
      }
    }
  });

  // A1 Comment: Close assistant panel
  closeBtn?.addEventListener("click", () => {
    panel?.classList.add("hidden");
    stopListening();
  });

  // A1 Comment: Send message with send button
  sendBtn?.addEventListener("click", () => {
    handleTextSubmit();
  });

  // A1 Comment: Send message with Enter key
  inputEl?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      handleTextSubmit();
    }
  });

  // A1 Comment: Handle quick command pills
  document.querySelectorAll(".va-quick-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const cmd = btn.getAttribute("data-cmd");
      if (cmd) {
        addLog("User", cmd);
        processCommand(cmd);
      }
    });
  });
}

// A1 Comment: Start voice recognition
function initSpeechSupport() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "es-ES";
    recognition.interimResults = false;

    // A1 Comment: Success result from speech
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      addLog("User", transcript);
      processCommand(transcript);
    };

    // A1 Comment: Speech ends
    recognition.onend = () => {
      isListening = false;
      updateStatusUI();
    };

    // A1 Comment: Error in speech
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      isListening = false;
      updateStatusUI();
    };
  } else {
    console.warn("Speech recognition not supported in this browser.");
  }
}

// A1 Comment: Start microphone listening
function startListening() {
  if (!recognition) {
    updateStatus("Voice recognition not supported. Use text.");
    return;
  }
  try {
    isListening = true;
    recognition.start();
    updateStatusUI();
  } catch (err) {
    console.error(err);
  }
}

// A1 Comment: Stop microphone listening
function stopListening() {
  if (recognition && isListening) {
    recognition.stop();
  }
}

// A1 Comment: Send text from input
function handleTextSubmit() {
  const inputEl = document.getElementById("va-input");
  if (!inputEl) return;
  const text = inputEl.value.trim();
  if (text) {
    addLog("User", text);
    inputEl.value = "";
    processCommand(text);
  }
}

// A1 Comment: Update status text in UI
function updateStatus(text) {
  const el = document.getElementById("va-status");
  if (el) el.textContent = text;
}

// A1 Comment: Update mic state styling
function updateStatusUI() {
  const statusEl = document.getElementById("va-status");
  const micIcon = document.getElementById("va-mic-icon");
  const trigger = document.getElementById("va-trigger");

  if (isListening) {
    if (statusEl) statusEl.textContent = "Listening...";
    if (trigger) {
      trigger.classList.add("from-red-600", "to-red-400");
      trigger.classList.remove("from-sport-600", "to-sport-400");
    }
  } else {
    if (statusEl) statusEl.textContent = "Click mic and speak";
    if (trigger) {
      trigger.classList.remove("from-red-600", "to-red-400");
      trigger.classList.add("from-sport-600", "to-sport-400");
    }
  }
}

// A1 Comment: Add message to panel logs
function addLog(sender, text) {
  const logsEl = document.getElementById("va-logs");
  if (!logsEl) return;

  const bubble = document.createElement("div");
  if (sender === "User") {
    bubble.className = "bg-zinc-800 rounded-2xl p-2.5 ml-8 text-xs border border-zinc-700 text-right text-zinc-100";
    bubble.innerHTML = `<strong>Tú:</strong> ${text}`;
  } else {
    bubble.className = "bg-sport-950/40 rounded-2xl p-2.5 mr-8 text-xs border border-sport-800 text-left text-zinc-200";
    bubble.innerHTML = `<strong>AI:</strong> ${text}`;
  }

  logsEl.appendChild(bubble);
  logsEl.scrollTop = logsEl.scrollHeight;
}

// A1 Comment: Process text command logic
async function processCommand(rawText) {
  const text = rawText.toLowerCase().trim();
  let spokenText = "";

  // A1 Comment: Navigate to cart
  if (text.includes("carrito") || text.includes("cart") || text.includes("compra")) {
    spokenText = "Abriendo el carrito de compras.";
    addLog("AI", spokenText);
    speak(spokenText);
    navigate("/carrito");
    return;
  }

  // A1 Comment: Navigate to home
  if (text.includes("inicio") || text.includes("home") || text.includes("portada")) {
    spokenText = "Volviendo a la página de inicio.";
    addLog("AI", spokenText);
    speak(spokenText);
    navigate("/");
    return;
  }

  // A1 Comment: Navigate to catalog
  if (text.includes("catálogo") || text.includes("catalogo") || text.includes("productos") || text.includes("tienda")) {
    spokenText = "Mostrando catálogo de productos.";
    addLog("AI", spokenText);
    speak(spokenText);
    navigate("/productos");
    return;
  }

  // A1 Comment: Clear shopping cart
  if (text.includes("vaciar") || text.includes("limpiar") || text.includes("vaciar carrito")) {
    vaciarCarrito();
    spokenText = "He vaciado todo tu carrito de compras.";
    addLog("AI", spokenText);
    speak(spokenText);
    return;
  }

  // A1 Comment: Request instructions help
  if (text.includes("ayuda") || text.includes("help") || text.includes("instrucciones") || text.includes("qué haces")) {
    spokenText = "Puedo buscar prendas, vaciar el carrito, ir a secciones o agregar productos. Di algo como: 'buscar camisetas' o 'añadir zapatillas'.";
    addLog("AI", spokenText);
    speak(spokenText);
    return;
  }

  // A1 Comment: Check if search query
  if (text.includes("buscar") || text.includes("search") || text.includes("encuentra")) {
    const term = text.replace("buscar", "").replace("search", "").replace("encuentra", "").trim();
    if (term) {
      spokenText = `Buscando ${term} en el catálogo.`;
      addLog("AI", spokenText);
      speak(spokenText);
      navigate(`/productos?buscar=${encodeURIComponent(term)}`);
    } else {
      spokenText = "¿Qué producto deseas buscar? Puedes decir por ejemplo: buscar camisetas.";
      addLog("AI", spokenText);
      speak(spokenText);
    }
    return;
  }

  // A1 Comment: Check if adding to cart
  if (text.includes("añadir") || text.includes("agregar") || text.includes("add") || text.includes("poner")) {
    let term = text
      .replace("añadir al carrito", "")
      .replace("agregar al carrito", "")
      .replace("añadir", "")
      .replace("agregar", "")
      .replace("add", "")
      .replace("poner", "")
      .trim();

    if (!term) {
      spokenText = "¿Qué artículo deseas añadir? Puedes decir: añadir camiseta.";
      addLog("AI", spokenText);
      speak(spokenText);
      return;
    }

    try {
      const productos = await obtenerProductos();
      const match = productos.find(p => p.nombre.toLowerCase().includes(term) || p.categoria.toLowerCase().includes(term));
      
      if (match) {
        const talla = match.tallas[0] || "M";
        const color = match.colores[0] || "Único";
        agregarAlCarrito(match, talla, color, 1);
        spokenText = `He añadido "${match.nombre}" al carrito en talla ${talla} y color ${color}.`;
        addLog("AI", spokenText);
        speak(spokenText);
      } else {
        spokenText = `Lo siento, no encontré ningún producto relacionado con "${term}".`;
        addLog("AI", spokenText);
        speak(spokenText);
      }
    } catch (err) {
      spokenText = "Ocurrió un error al intentar agregar al carrito.";
      addLog("AI", spokenText);
      speak(spokenText);
    }
    return;
  }

  // A1 Comment: Default fallback response
  spokenText = "No entendí ese comando. Di 'ayuda' para ver qué puedo hacer.";
  addLog("AI", spokenText);
  speak(spokenText);
}

// A1 Comment: Synthesize text to speech
function speak(text) {
  if (!synth) return;
  // A1 Comment: Stop current talking
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-ES";
  utterance.rate = 1.0;
  utterance.pitch = 1.1; // A1 Comment: Set higher pitch for friendly voice clone

  // A1 Comment: Animate waves when speaking
  utterance.onstart = () => {
    startWaveAnimation(true);
  };
  utterance.onend = () => {
    startWaveAnimation(false);
  };

  synth.speak(utterance);
}

// A1 Comment: Global wave animation toggler
let isSpeaking = false;
function startWaveAnimation(speaking) {
  isSpeaking = speaking;
}

// A1 Comment: Render sound wave on HTML canvas
function drawWaveform() {
  const canvas = document.getElementById("va-wave-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let offset = 0;

  function animate() {
    if (!canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // A1 Comment: Set line properties
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "rgba(224, 92, 26, 0.85)"; // Sport orange color

    ctx.beginPath();
    
    // A1 Comment: Change wave height based on status
    const amplitude = isSpeaking ? 25 : (isListening ? 15 : 4);
    const frequency = isSpeaking ? 0.08 : (isListening ? 0.05 : 0.02);

    for (let x = 0; x < canvas.width; x++) {
      const y = canvas.height / 2 + Math.sin(x * frequency + offset) * amplitude * Math.sin(x * 0.01);
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();

    // A1 Comment: Draw second decorative cyan wave
    ctx.strokeStyle = "rgba(14, 165, 233, 0.4)";
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x++) {
      const y = canvas.height / 2 + Math.cos(x * (frequency * 0.9) - offset) * (amplitude * 0.7) * Math.sin(x * 0.01);
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    offset += isSpeaking ? 0.15 : (isListening ? 0.08 : 0.02);
    requestAnimationFrame(animate);
  }

  animate();
}
