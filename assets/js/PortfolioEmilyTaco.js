/* ==========================================================================
   Emily Taco · Portfolio
   GSAP + Lenis + Hero Animations
   ========================================================================== */

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Scroll manual al recargar
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
window.scrollTo(0, 0);

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/* --------------------------------------------------------------------------
   1) Lenis (Smooth Scroll)
   -------------------------------------------------------------------------- */
let lenis = null;
if (!prefersReducedMotion && typeof Lenis !== "undefined") {
  lenis = new Lenis({
    lerp: 0.1,
    smoothWheel: true,
    wheelMultiplier: 1,
  });
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  lenis.stop(); // Se detiene durante la intro
}

/* --------------------------------------------------------------------------
   2) Hero Intro & Animation
   -------------------------------------------------------------------------- */
if (!prefersReducedMotion) {
  // Estado inicial: Todo oculto para evitar parpadeos
  document.body.classList.add("is-intro");

  // IMPORTANTE: Usamos las clases correctas de tu HTML
  gsap.set(".tilt-card", { opacity: 0, scale: 0.9, y: 30, rotationX: 10 });
  gsap.set(".wave-badge", { scale: 0, opacity: 0 }); // El círculo empieza invisible y pequeño
  gsap.set(".hero-ref-name", { opacity: 0, x: -20 });
  gsap.set(".hero-ref-big", { opacity: 0, y: 40 });
  gsap.set(".hero-ref-sub", { opacity: 0, x: 20 });

  // Timeline de Entrada
  const heroTl = gsap.timeline({
    defaults: { ease: "power4.out" },
    onComplete: () => {
      document.body.classList.remove("is-intro");
      ScrollTrigger.refresh();
      if (lenis) {
        lenis.start();
        lenis.scrollTo(0, { immediate: true });
      }
    },
  });

  heroTl
    // 1. Aparece la foto central
    .to(".tilt-card", {
      opacity: 1,
      scale: 1,
      y: 0,
      rotationX: 0,
      duration: 1.4,
    })
    // 2. ¡POP! Aparece el círculo amarillo (wave-badge)
    .to(
      ".wave-badge",
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        ease: "back.out(1.7)",
      },
      "-=0.8"
    )
    // 3. Suben los textos grandes (DISEÑO / GRÁFICO)
    .to(
      ".hero-ref-big",
      {
        opacity: 1,
        y: 0,
        duration: 1.1,
        stagger: 0.1,
      },
      "-=0.6"
    )
    // 4. Entran los textos cursiva laterales
    .to(".hero-ref-name", { opacity: 1, x: 0, duration: 1 }, "-=1")
    .to(".hero-ref-sub", { opacity: 1, x: 0, duration: 1 }, "-=0.9");

  // Parallax Effect (se activa al hacer scroll)
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

  gsap.to(".tilt-card", {
    y: 100,
    ease: "none",
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "bottom top+=100",
      scrub: 0.5,
    },
  });
}

/* --------------------------------------------------------------------------
   3) Resto de Secciones (Fade Up)
   -------------------------------------------------------------------------- */
if (!prefersReducedMotion) {
  gsap.utils.toArray("section").forEach((section) => {
    if (section.id === "hero") return;
    const items = section.querySelectorAll(".gsap-reveal");
    if (!items.length) return;

    gsap.fromTo(
      items,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: section, start: "top 80%" },
      }
    );
  });
}

/* --------------------------------------------------------------------------
   4) Micro-interacciones (Botones)
   -------------------------------------------------------------------------- */
document.querySelectorAll(".btn-accent").forEach((btn) => {
  btn.addEventListener("mouseenter", () =>
    gsap.to(btn, { y: -2, duration: 0.2 })
  );
  btn.addEventListener("mouseleave", () =>
    gsap.to(btn, { y: 0, duration: 0.2 })
  );
});
