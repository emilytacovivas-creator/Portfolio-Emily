/* ==========================================================================
   Emily Taco · Portfolio
   GSAP + Lenis + Master Stage + Smooth Accordion + Contact Copy
   ========================================================================== */

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

if ("scrollRestoration" in history) history.scrollRestoration = "manual";
window.scrollTo(0, 0);

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/* 1. LENIS SMOOTH SCROLL */
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

/* 2. SETUP INICIAL 3D */
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

/* 3. LOGICA MASTER SCROLL */
function initMasterScroll() {
  ScrollTrigger.refresh();

  const stage = document.querySelector("#master-stage");
  const card = document.querySelector("#tiltCard");
  const heroText = document.querySelector("#heroText");
  const servicesText = document.querySelector("#servicesText");

  const getMoveRight = () => {
    return window.innerWidth < 992 ? 0 : window.innerWidth * 0.25;
  };

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: stage,
      start: "top top",
      end: "+=150%",
      scrub: 1,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

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

  tl.to(
    card,
    {
      rotationY: -180,
      x: getMoveRight,
      scale: 0.85,
      duration: 1.5,
      ease: "power2.inOut",
    },
    "start"
  );

  tl.fromTo(
    servicesText,
    {
      y: () => window.innerHeight,
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

/* 4. INTRO ANIMATION */
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

/* 5. SMOOTH ACCORDION (GSAP) */
function initAccordion() {
  const detailsElements = document.querySelectorAll(
    ".services-accordion details"
  );

  detailsElements.forEach((targetDetail) => {
    const summary = targetDetail.querySelector("summary");
    const content = targetDetail.querySelector(".accordion-content");

    if (!targetDetail.hasAttribute("open")) {
      gsap.set(content, { height: 0, opacity: 0 });
    } else {
      targetDetail.classList.add("is-open");
    }

    summary.addEventListener("click", (e) => {
      e.preventDefault();

      const isOpen = targetDetail.classList.contains("is-open");

      // Cerrar otros
      detailsElements.forEach((detail) => {
        if (detail !== targetDetail && detail.classList.contains("is-open")) {
          const otherContent = detail.querySelector(".accordion-content");
          gsap.to(otherContent, {
            height: 0,
            opacity: 0,
            duration: 0.4,
            ease: "power2.inOut",
            onComplete: () => {
              detail.removeAttribute("open");
              detail.classList.remove("is-open");
            },
          });
        }
      });

      // Toggle actual
      if (isOpen) {
        targetDetail.classList.remove("is-open");
        gsap.to(content, {
          height: 0,
          opacity: 0,
          duration: 0.4,
          ease: "power2.inOut",
          onComplete: () => targetDetail.removeAttribute("open"),
        });
      } else {
        targetDetail.setAttribute("open", "");
        targetDetail.classList.add("is-open");
        gsap.fromTo(
          content,
          { height: 0, opacity: 0 },
          { height: "auto", opacity: 1, duration: 0.4, ease: "power2.out" }
        );
      }
    });
  });
}

/* 6. REVEAL SECTIONS */
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

/* 7. MICRO-INTERACCIONES */
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

/* 8. FUNCIONALIDAD COPIAR CONTACTO (NUEVO) */
function initContactCopy() {
  const copyButtons = document.querySelectorAll(".btn-contact-copy");

  copyButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const textToCopy = btn.getAttribute("data-copy-text");
      const originalContent = btn.innerHTML;
      const isPhone = btn.id === "btnPhone";
      const successMsg = isPhone ? "Teléfono copiado" : "Email copiado";

      // Icono check SVG
      const checkIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ms-2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>`;

      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            // Éxito: Cambiar estilo y texto
            btn.classList.add("copied");
            btn.innerHTML = `<span class="btn-text">${successMsg}</span> ${checkIcon}`;

            // Revertir después de 3 segundos
            setTimeout(() => {
              btn.classList.remove("copied");
              btn.innerHTML = originalContent;
            }, 3000);
          })
          .catch((err) => {
            console.error("Error al copiar: ", err);
          });
      }
    });
  });
}

/* INIT */
if (!prefersReducedMotion) {
  setup3D();
  revealSections();
  microInteractions();
  initAccordion();
  initContactCopy(); // Activamos botones de copia
  intro();
} else {
  if (lenis) lenis.destroy();
  gsap.set("#tiltCard, .hero-ref-big, .hero-ref-name, .hero-ref-sub", {
    opacity: 1,
    y: 0,
  });
  initContactCopy(); // Activamos botones de copia también aquí
}
