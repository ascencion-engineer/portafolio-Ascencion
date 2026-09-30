/* =========================================================
   LÓGICA DEL PORTAFOLIO — Ascención Linares
   Archivo: js/main.js
   ========================================================= */
/* =========================================================
   CONFIGURACIÓN — edita solo esta parte
   ========================================================= */
const CONFIG = {
  // Número de WhatsApp con código de país, sin espacios ni "+". México = 52
  whatsapp: "528411270929",
  whatsappText: "Hola Ascención, vi tu portafolio y me gustaría cotizar un proyecto.",
  email: "ascencion.linares.mx@gmail.com",
  // Crea un formulario gratis en https://formspree.io y pega aquí la URL.
  // Si lo dejas vacío, el formulario abre WhatsApp con el mensaje escrito.
  formEndpoint: ""
};

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const waLink = (text) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;

/* ---------- Enlaces de WhatsApp y correo ---------- */
function initLinks() {
  document.querySelectorAll("[data-whatsapp]").forEach((a) => {
    a.href = waLink(CONFIG.whatsappText);
    a.target = "_blank";
    a.rel = "noopener";
  });
  document.querySelectorAll("[data-email]").forEach((a) => {
    a.href = `mailto:${CONFIG.email}`;
    a.textContent = CONFIG.email;
  });
  document.getElementById("year").textContent = new Date().getFullYear();
}

/* ---------- Navegación: fondo al hacer scroll, menú móvil, sección activa ---------- */
function initNav() {
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  const progress = document.querySelector(".progress");

  const onScroll = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 20);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const closeMenu = () => {
    links.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menú");
  };
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  });
  links.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

  // Resalta en el menú la sección visible
  const navAnchors = [...links.querySelectorAll("a")];
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navAnchors.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${entry.target.id}`));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  document.querySelectorAll("main section[id]").forEach((s) => observer.observe(s));
}

/* ---------- Fondo de partículas (sutil) ---------- */
function initParticles() {
  if (typeof particlesJS === "undefined") return;
  const small = window.innerWidth < 760;
  particlesJS("particles", {
    particles: {
      number: { value: small ? 28 : 60, density: { enable: true, value_area: 900 } },
      color: { value: "#E2B458" },
      shape: { type: "circle" },
      opacity: { value: 0.35, random: true },
      size: { value: 2, random: true },
      line_linked: { enable: true, distance: 140, color: "#E2B458", opacity: 0.08, width: 1 },
      move: { enable: !prefersReducedMotion, speed: 0.6, out_mode: "out" }
    },
    interactivity: {
      detect_on: "canvas",
      events: { onhover: { enable: !small, mode: "grab" }, resize: true },
      modes: { grab: { distance: 160, line_linked: { opacity: 0.25 } } }
    },
    retina_detect: true
  });
}

/* ---------- Animaciones con GSAP + ScrollTrigger ---------- */
function initAnimations() {
  if (typeof gsap === "undefined" || prefersReducedMotion) return;
  gsap.registerPlugin(ScrollTrigger);

  // 1) Entrada del inicio: el nombre sube línea por línea
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  tl.from("[data-hero-line]", { yPercent: 110, duration: 1.1, stagger: 0.12 })
    .from("[data-hero]", { y: 24, opacity: 0, duration: 0.8, stagger: 0.1 }, "-=0.7")
    .from("[data-hero-visual]", { scale: 0.9, opacity: 0, duration: 1 }, "-=0.9");

  // Órbita dorada alrededor del avatar (giro lento y continuo)
  gsap.to("#orbit", { rotation: 360, duration: 40, repeat: -1, ease: "none" });

  // 2) Bloques de texto: aparecen suavemente al entrar en pantalla
  gsap.utils.toArray(".reveal").forEach((el) => {
    gsap.from(el, {
      y: 40, opacity: 0, duration: 0.9, ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 85%", once: true }
    });
  });

  // 3) Habilidades: los íconos entran en cascada, grupo por grupo
  gsap.utils.toArray(".skills-group").forEach((group) => {
    gsap.from(group.querySelectorAll(".skill"), {
      y: 30, opacity: 0, scale: 0.92, duration: 0.6, stagger: 0.08, ease: "back.out(1.6)",
      scrollTrigger: { trigger: group, start: "top 85%", once: true }
    });
  });

  // 4) Proyectos: la tarjeta entra y su ilustración hace un ligero parallax
  gsap.utils.toArray(".project").forEach((card) => {
    gsap.from(card, {
      y: 60, opacity: 0, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: card, start: "top 88%", once: true }
    });
    const art = card.querySelector(".project-media > *");
    if (art) {
      const isPhoto = art.tagName === "IMG";   // las fotos se amplían un poco para no dejar huecos
      gsap.fromTo(art, { y: 20, scale: isPhoto ? 1.12 : 1 }, {
        y: -20, scale: isPhoto ? 1.12 : 1, ease: "none",
        scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true }
      });
    }
  });
}

/* ---------- Formulario de contacto ---------- */
function initForm() {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  const button = document.getElementById("submitBtn");

  const setError = (input, msg) => {
    const field = input.closest(".field");
    field.classList.toggle("has-error", Boolean(msg));
    field.querySelector(".field-error").textContent = msg || "";
  };

  const validate = () => {
    let ok = true;
    const name = form.nombre, email = form.correo, msg = form.mensaje;
    if (name.value.trim().length < 2) { setError(name, "Escribe tu nombre."); ok = false; } else setError(name);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { setError(email, "Escribe un correo válido, por ejemplo nombre@correo.com."); ok = false; } else setError(email);
    if (msg.value.trim().length < 10) { setError(msg, "Describe tu proyecto en al menos 10 caracteres."); ok = false; } else setError(msg);
    return ok;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.className = "form-status";
    status.textContent = "";
    if (form._gotcha.value) return;          // bot detectado
    if (!validate()) return;

    const data = {
      nombre: form.nombre.value.trim(),
      correo: form.correo.value.trim(),
      mensaje: form.mensaje.value.trim()
    };

    // Opción A: sin Formspree → abre WhatsApp con el mensaje
    if (!CONFIG.formEndpoint) {
      const text = `Hola Ascención, soy ${data.nombre} (${data.correo}).\n\n${data.mensaje}`;
      window.open(waLink(text), "_blank", "noopener");
      status.classList.add("ok");
      status.textContent = "Se abrió WhatsApp con tu mensaje. Solo presiona enviar.";
      form.reset();
      return;
    }

    // Opción B: con Formspree → envía al correo
    button.disabled = true;
    button.lastChild.textContent = " Enviando…";
    try {
      const res = await fetch(CONFIG.formEndpoint, {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(res.status);
      status.classList.add("ok");
      status.textContent = "Mensaje enviado. Te responderé a tu correo.";
      form.reset();
    } catch {
      status.classList.add("err");
      status.textContent = "No se pudo enviar el mensaje. Revisa tu conexión o escríbeme por WhatsApp.";
    } finally {
      button.disabled = false;
      button.lastChild.textContent = " Enviar mensaje";
    }
  });

  // Quita el error en cuanto la persona corrige el campo
  form.querySelectorAll("input, textarea").forEach((el) =>
    el.addEventListener("input", () => { if (el.closest(".field")) setError(el); })
  );
}

/* ---------- Arranque ---------- */
window.addEventListener("DOMContentLoaded", () => {
  initLinks();
  initNav();
  initParticles();
  initAnimations();
  initForm();
});
