/* ==========================================================================
   Emily Taco · Portfolio
   GSAP + Lenis smooth scroll (stable, no jump after intro)
   ========================================================================== */

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Evita que el navegador "recuerde" el scroll al recargar
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
window.scrollTo(0, 0);

// Reduced motion
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;
if (prefersReducedMotion) {
  ScrollTrigger.disable();
  gsap.set(".gsap-reveal", { opacity: 1, y: 0, clearProps: "transform" });
}

/* --------------------------------------------------------------------------
   1) Lenis (smooth scroll)
   -------------------------------------------------------------------------- */
let lenis = null;

if (!prefersReducedMotion) {
  if (typeof Lenis === "undefined") {
    console.warn(
      "❌ Lenis undefined → el CDN no está cargando o está antes de tu JS."
    );
  } else {
    lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      smoothTouch: true,
      wheelMultiplier: 1,
    });

    // Un solo loop (GSAP ticker)
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);

    // ScrollTrigger update con Lenis
    lenis.on("scroll", ScrollTrigger.update);

    // Bloquea scroll durante la intro (para arreglar el "salto")
    lenis.stop();

    console.log("✅ Lenis activo");
  }
}

/* --------------------------------------------------------------------------
   2) Navbar state
   -------------------------------------------------------------------------- */
const navbar = document.querySelector("#navbar");
function setNavbarScrolledState() {
  if (!navbar) return;
  const y = lenis ? lenis.scroll : window.scrollY;
  navbar.classList.toggle("is-scrolled", y > 10);
}
setNavbarScrolledState();
window.addEventListener("scroll", setNavbarScrolledState, { passive: true });
if (lenis) lenis.on("scroll", setNavbarScrolledState);

/* --------------------------------------------------------------------------
   3) Hero intro + parallax 
   -------------------------------------------------------------------------- */
if (!prefersReducedMotion) {
  // Bloquea scroll nativo durante la intro (evita “rueda acumulada”)
  document.documentElement.classList.add("is-intro");
  document.body.classList.add("is-intro");

  gsap.set(".hero-card", { opacity: 0, y: 40 });
  gsap.set(".hero-card .gsap-reveal", { opacity: 0, y: 20 });

  // Función: crea parallax DESPUÉS de la intro
  const setupHeroParallax = () => {
    ScrollTrigger.getAll()
      .filter((st) => st.vars?.id === "heroParallax")
      .forEach((st) => st.kill());

    gsap.to(".hero-bg", {
      y: 80,
      ease: "none",
      immediateRender: false,
      scrollTrigger: {
        id: "heroParallax",
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: 0.8,
        invalidateOnRefresh: true,
      },
    });

    gsap.to(".hero-card", {
      y: 120,
      scale: 0.975,
      ease: "none",
      immediateRender: false,
      scrollTrigger: {
        id: "heroParallax",
        trigger: "#hero",
        start: "top top",
        end: "bottom top+=140",
        scrub: 0.8,
        invalidateOnRefresh: true,
      },
    });
  };

  const heroTl = gsap.timeline({
    defaults: { ease: "power3.out" },
    onComplete: () => {
      // Quita el bloqueo de scroll
      document.documentElement.classList.remove("is-intro");
      document.body.classList.remove("is-intro");

      requestAnimationFrame(() => {
        // Primero refresca mediciones
        ScrollTrigger.refresh(true);

        // Asegura Lenis alineado
        if (lenis) {
          lenis.scrollTo(window.scrollY, { immediate: true });
          lenis.start();
        }

        // Crea parallax DESPUÉS del refresh
        setupHeroParallax();
        ScrollTrigger.refresh(true);
      });
    },
  });

  heroTl
    .to(".hero-card", { opacity: 1, y: 0, duration: 1.05 })
    .to(
      ".hero-card .gsap-reveal",
      { opacity: 1, y: 0, duration: 0.85, stagger: 0.12 },
      "-=0.65"
    );
}

/* --------------------------------------------------------------------------
   4) Section reveals
   -------------------------------------------------------------------------- */
if (!prefersReducedMotion) {
  gsap.utils.toArray("section").forEach((section) => {
    if (section.id === "hero") return;

    const items = section.querySelectorAll(".gsap-reveal");
    if (!items.length) return;

    gsap.fromTo(
      items,
      { opacity: 0, y: 26 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          invalidateOnRefresh: true,
        },
      }
    );
  });
}

/* --------------------------------------------------------------------------
   5) Anchor scroll (menú/botones)
   -------------------------------------------------------------------------- */
document
  .querySelectorAll(
    'a.nav-link[href^="#"], a.btn-accent[href^="#"], a.btn-ghost[href^="#"]'
  )
  .forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      // Cierra navbar en móvil
      const navCollapse = document.querySelector("#navbarNav");
      if (navCollapse && navCollapse.classList.contains("show")) {
        bootstrap.Collapse.getOrCreateInstance(navCollapse).hide();
      }

      if (lenis) {
        lenis.scrollTo(target, { offset: -90, duration: 1.15 });
      } else {
        gsap.to(window, {
          duration: 0.9,
          scrollTo: { y: target, offsetY: 90 },
          ease: "power3.out",
        });
      }
    });
  });

/* --------------------------------------------------------------------------
   6) Micro-interactions
   -------------------------------------------------------------------------- */
if (!prefersReducedMotion) {
  document.querySelectorAll(".btn-accent, .btn-ghost").forEach((btn) => {
    btn.addEventListener("mouseenter", () =>
      gsap.to(btn, { y: -2, duration: 0.2, ease: "power2.out" })
    );
    btn.addEventListener("mouseleave", () =>
      gsap.to(btn, { y: 0, duration: 0.2, ease: "power2.out" })
    );
  });
}

// Último refresh al terminar de cargar todo
window.addEventListener("load", () => ScrollTrigger.refresh(true));
