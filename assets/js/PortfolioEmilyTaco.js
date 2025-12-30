/* ==========================================================================
   Emily Taco · Portfolio
   GSAP + Lenis smooth scroll
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. Plugins + Reduced Motion
   -------------------------------------------------------------------------- */
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/* --------------------------------------------------------------------------
   2. Lenis (smooth scroll)
   - Evitamos "duration" alta que provoca lag + tirón
   - Usamos "lerp" para un smooth estable (tipo spwn)
   -------------------------------------------------------------------------- */
let lenis = null;

if (!prefersReducedMotion && typeof Lenis !== "undefined") {
  lenis = new Lenis({
    lerp: 0.1, // 0.08–0.12 = suave sin “latigazo”
    smoothWheel: true,
    smoothTouch: false, // pon true si quieres también inercia en móvil
    wheelMultiplier: 1.0,
  });

  // Un SOLO loop (GSAP ticker)
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // Sincroniza ScrollTrigger
  lenis.on("scroll", ScrollTrigger.update);

  // Refresh al cargar (imagenes/fuentes)
  window.addEventListener("load", () => ScrollTrigger.refresh());

  console.log("✅ Lenis activo");
} else {
  console.warn("❌ Lenis no activo (Lenis undefined o reduced motion)");
}

/* --------------------------------------------------------------------------
   3. Navbar state
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
   4. Hero intro + parallax
   -------------------------------------------------------------------------- */
if (!prefersReducedMotion) {
  gsap.set(".hero-card", { opacity: 0, y: 40 });
  gsap.set(".hero-card .gsap-reveal", { opacity: 0, y: 20 });

  gsap
    .timeline({ defaults: { ease: "power3.out" } })
    .to(".hero-card", { opacity: 1, y: 0, duration: 1.05 })
    .to(
      ".hero-card .gsap-reveal",
      { opacity: 1, y: 0, duration: 0.85, stagger: 0.12 },
      "-=0.65"
    );

  gsap.to(".hero-bg", {
    y: 80,
    ease: "none",
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "bottom top",
      scrub: 0.8,
    },
  });

  gsap.to(".hero-card", {
    y: 120,
    scale: 0.975,
    ease: "none",
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "bottom top+=140",
      scrub: 0.8,
    },
  });
}

/* --------------------------------------------------------------------------
   5. Section reveals (por sección)
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
        },
      }
    );
  });
}

/* --------------------------------------------------------------------------
   6. Anchor scroll (menú + botones)
   -------------------------------------------------------------------------- */
const linksToScroll = document.querySelectorAll(
  'a.nav-link[href^="#"], a.btn-accent[href^="#"], a.btn-ghost[href^="#"]'
);

linksToScroll.forEach((link) => {
  link.addEventListener("click", (e) => {
    const targetId = link.getAttribute("href");
    if (!targetId || !targetId.startsWith("#")) return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    // Cierra el menú en móvil
    const navCollapse = document.querySelector("#navbarNav");
    if (navCollapse && navCollapse.classList.contains("show")) {
      const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navCollapse);
      bsCollapse.hide();
    }

    // Lenis (mejor)
    if (lenis) {
      lenis.scrollTo(target, {
        offset: -90,
        duration: 1.1,
      });
      return;
    }

    // Fallback
    gsap.to(window, {
      duration: 0.9,
      scrollTo: { y: target, offsetY: 90 },
      ease: "power3.out",
    });
  });
});

/* --------------------------------------------------------------------------
   7. Micro-interactions
   -------------------------------------------------------------------------- */
if (!prefersReducedMotion) {
  document.querySelectorAll(".btn-accent, .btn-ghost").forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      gsap.to(btn, { y: -2, duration: 0.2, ease: "power2.out" });
    });
    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, { y: 0, duration: 0.2, ease: "power2.out" });
    });
  });
}
