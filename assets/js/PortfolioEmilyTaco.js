/* ==========================================================================
   Emily Taco · Portfolio
   GSAP + Lenis + Card Flip (Left/Right) + Move Right
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
  lenis.stop();
}

/* 2. 3D estable */
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

/* 3. Intro */
function intro() {
  document.body.classList.add("is-intro");

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
      initCardFlipScroll();
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

/* 4. Scroll effect (VERSIÓN “PERFECTO” que me pasaste) */
function initCardFlipScroll() {
  const hero = document.querySelector("#hero");
  const servicios = document.querySelector("#servicios-list");
  const tiltCard = document.querySelector("#tiltCard");
  const slotHero = document.querySelector("#cardSlotHero");
  const slotServicios = document.querySelector("#cardSlotServices");

  let flipped = false;

  const moveRight = () => {
    if (window.innerWidth < 992) return 0;
    return window.innerWidth * 0.24;
  };

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: "top top",
      endTrigger: servicios,
      end: "top top",
      scrub: 1,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate(self) {
        if (!flipped && self.progress > 0.2 && window.innerWidth >= 992) {
          flipped = true;

          const state = Flip.getState(tiltCard);
          slotServicios.appendChild(tiltCard);

          Flip.from(state, {
            duration: 0.9,
            ease: "power2.inOut",
            absolute: true,
            scale: true,
          });
        }

        if (flipped && self.progress < 0.35 && window.innerWidth >= 992) {
          flipped = false;

          const state = Flip.getState(tiltCard);
          slotHero.appendChild(tiltCard);

          Flip.from(state, {
            duration: 0.9,
            ease: "power2.inOut",
            absolute: true,
            scale: true,
          });
        }
      },
    },
  });

  tl.to(
    [".hero-ref-left", ".hero-ref-right"],
    { opacity: 0, y: -50, duration: 0.35, ease: "power1.out" },
    0
  )
    .to(
      "#tiltCard",
      {
        x: moveRight,
        rotationY: -179.9,
        z: 120,
        ease: "expo.inOut",
        duration: 1.0,
        force3D: true,
      },
      0
    )
    .to(".wave-badge", { opacity: 0, duration: 0.2 }, 0);
}

/* 5. Reveal secciones */
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

/* 6. Micro-interacciones */
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

/* INIT */
if (!prefersReducedMotion) {
  setup3D();
  intro();
  revealSections();
  microInteractions();
} else {
  if (lenis) lenis.destroy();
}
