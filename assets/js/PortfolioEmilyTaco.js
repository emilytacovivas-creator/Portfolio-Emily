/* ==========================================================================
   Emily Taco · Portfolio
   GSAP + Lenis + Master Stage (Unified Scroll)
   ========================================================================== */

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

if ("scrollRestoration" in history) history.scrollRestoration = "manual";
window.scrollTo(0, 0);

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/* 1. Lenis Smooth Scroll */
let lenis = null;
if (!prefersReducedMotion && typeof Lenis !== "undefined") {
  lenis = new Lenis({
    lerp: 0.08,
    smoothWheel: true,
  });

  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  lenis.stop(); // Lo pausamos hasta que termine la intro
}

/* 2. Setup Inicial 3D */
function setup3D() {
  gsap.set(".tilt-stage", {
    perspective: 1600,
    transformStyle: "preserve-3d",
  });

  gsap.set("#tiltCard", {
    transformStyle: "preserve-3d",
    transformOrigin: "50% 50%",
    force3D: true,
    willChange: "transform",
  });

  gsap.set(".wave-badge", {
    z: 40,
    transformOrigin: "center center",
  });
}

/* 3. Lógica del Master Scroll (La magia nueva) */
function initMasterScroll() {
  // Aseguramos refrescar cálculos
  ScrollTrigger.refresh();

  const stage = document.querySelector("#master-stage");
  const card = document.querySelector("#tiltCard");
  const heroText = document.querySelector("#heroText");
  const servicesText = document.querySelector("#servicesText");

  // Cálculo responsive para mover la tarjeta
  const getMoveRight = () => {
    return window.innerWidth < 992 ? 0 : window.innerWidth * 0.25;
  };

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: stage,
      start: "top top",
      end: "+=150%", // Aumenta este valor si quieres que la transición sea más lenta
      scrub: 1,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true, // Recalcula si cambian el tamaño de ventana
    },
  });

  // --- LA COREOGRAFÍA ---

  // A. El texto del Hero sube y desaparece
  tl.to(
    heroText,
    {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: "power2.inOut",
    },
    "start"
  );

  // B. La tarjeta gira y se mueve a la derecha
  tl.to(
    card,
    {
      rotationY: -180,
      x: getMoveRight,
      scale: 0.85, // Un pelín más pequeño para dar aire
      duration: 1.5,
      ease: "power2.inOut",
    },
    "start"
  );

  // C. El texto de Servicios entra desde abajo
  tl.fromTo(
    servicesText,
    {
      y: () => window.innerHeight, // Función flecha para que sea dinámico
      opacity: 0,
    },
    {
      y: 0,
      opacity: 1,
      duration: 1.5,
      ease: "power2.out",
    },
    "start+=0.2"
  );
}

/* 4. Intro Animation */
function intro() {
  document.body.classList.add("is-intro");

  // Estados iniciales para la intro
  gsap.set("#tiltCard", { opacity: 0, scale: 0.8, y: 50, rotationY: 0, x: 0 });
  gsap.set(".wave-badge", { opacity: 0, scale: 0 });
  gsap.set(".hero-ref-big", { y: "100%", opacity: 0 });
  gsap.set(".hero-ref-name", { opacity: 0 });
  gsap.set(".hero-ref-sub", { opacity: 0 });

  const heroTl = gsap.timeline({
    defaults: { ease: "power3.out", duration: 1.4 },
    delay: 0.2,
    onComplete: () => {
      document.body.classList.remove("is-intro");
      if (lenis) lenis.start();

      // AQUÍ ESTABA EL ERROR: Llamamos a la función correcta
      initMasterScroll();
    },
  });

  heroTl
    .to("#tiltCard", {
      opacity: 1,
      scale: 1,
      y: 0,
      rotationY: 0,
      duration: 1.6,
      ease: "expo.out",
    })
    .to(
      ".hero-ref-big",
      { y: "0%", opacity: 1, stagger: 0.1, duration: 1.2 },
      "-=1.2"
    )
    .to(".hero-ref-name", { opacity: 1 }, "-=0.8")
    .to(".hero-ref-sub", { opacity: 1 }, "-=0.8")
    .to(
      ".wave-badge",
      { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(2)" },
      "-=1"
    );
}

/* 5. Reveal del resto de secciones (About, Contact, etc) */
function revealSections() {
  gsap.utils.toArray(".gsap-reveal").forEach((item) => {
    gsap.fromTo(
      item,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });
}

/* 6. Micro-interacciones (Botones) */
function microInteractions() {
  document.querySelectorAll(".btn-accent").forEach((btn) => {
    btn.addEventListener("mouseenter", () =>
      gsap.to(btn, { scale: 1.05, duration: 0.3 })
    );
    btn.addEventListener("mouseleave", () =>
      gsap.to(btn, { scale: 1, duration: 0.3 })
    );
  });
}

/* INIT - Ejecución Principal */
if (!prefersReducedMotion) {
  setup3D();
  revealSections();
  microInteractions();
  // Lanzamos la intro, la cual lanzará initMasterScroll al terminar
  intro();
} else {
  // Accesibilidad: Si prefieren no movimiento, matamos lenis
  if (lenis) lenis.destroy();
  // Y mostramos todo sin animar
  gsap.set("#tiltCard, .hero-ref-big, .hero-ref-name, .hero-ref-sub", {
    opacity: 1,
    y: 0,
  });
}
