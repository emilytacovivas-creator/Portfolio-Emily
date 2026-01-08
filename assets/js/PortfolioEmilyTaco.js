/* ==========================================================================
   Emily Taco · Portfolio - FIX TOTAL: Subrayado + Visibilidad
   ========================================================================== */

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

if ("scrollRestoration" in history) history.scrollRestoration = "manual";
window.scrollTo(0, 0);

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/* 1. LENIS */
let lenis = null;
if (!prefersReducedMotion && typeof Lenis !== "undefined") {
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
}

/* 2. SETUP 3D */
function setup3D() {
  gsap.set(".tilt-stage", { perspective: 1600, transformStyle: "preserve-3d" });
  gsap.set("#tiltCard", {
    transformStyle: "preserve-3d",
    transformOrigin: "50% 50%",
    force3D: true,
  });
  gsap.set(".wave-badge", { z: 40 });
  // Aseguramos visibilidad inicial de secciones
  gsap.set(".gsap-reveal", { opacity: 1, y: 0 });
}

/* 3. NAVEGACIÓN ACTIVA (SCROLLSPY FIX) */
function updateActiveNav(id) {
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === id);
  });
}

/* 4. ANIMACIÓN PRINCIPAL (HOME -> SERVICIOS) */
function initMasterScroll() {
  ScrollTrigger.matchMedia({
    "(min-width: 992px)": function () {
      const stage = document.querySelector("#master-stage");
      const card = document.querySelector("#tiltCard");
      const heroText = document.querySelector("#heroText");
      const servicesText = document.querySelector("#servicesText");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: "+=150%",
          scrub: 1,
          pin: true,
          onUpdate: (self) => {
            // Si el scroll de la home pasa del 40%, subrayamos Servicios
            if (self.progress > 0.4) {
              updateActiveNav("#services-layer");
            } else {
              updateActiveNav("#master-stage");
            }
          },
        },
      });

      tl.to(heroText, { y: -100, opacity: 0, duration: 1 }, "start")
        .to(
          card,
          {
            rotationY: -180,
            x: () => window.innerWidth * 0.25,
            scale: 0.85,
            duration: 1.5,
          },
          "start"
        )
        .fromTo(
          servicesText,
          { y: 100, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.5 },
          "start+=0.2"
        );
    },
    "(max-width: 991px)": function () {
      // En móvil no hay animación de pin, Servicios es una sección normal
      ScrollTrigger.create({
        trigger: "#services-layer",
        start: "top 20%",
        onToggle: (self) => self.isActive && updateActiveNav("#services-layer"),
      });
    },
  });

  // ScrollSpy para el resto de la web
  ["#about", "#projects", "#contact"].forEach((id) => {
    ScrollTrigger.create({
      trigger: id,
      start: "top 40%",
      end: "bottom 40%",
      onEnter: () => updateActiveNav(id),
      onEnterBack: () => updateActiveNav(id),
    });
  });
}

/* 5. INTRO ANIMATION */
function intro() {
  const heroTl = gsap.timeline({
    onComplete: () => {
      if (lenis) lenis.start();
      initMasterScroll();
      revealRestOfSite();
      ScrollTrigger.refresh();
    },
  });

  heroTl
    .fromTo(
      "#tiltCard",
      { opacity: 0, scale: 0.8, y: 50 },
      { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "expo.out" }
    )
    .fromTo(
      ".hero-ref-big",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 1 },
      "-=0.8"
    )
    .fromTo(
      ".hero-ref-name, .hero-ref-sub",
      { opacity: 0 },
      { opacity: 1 },
      "-=0.5"
    )
    .fromTo(
      ".wave-badge",
      { scale: 0 },
      { scale: 1, duration: 0.5, ease: "back.out" },
      "-=0.5"
    );
}

/* 6. REVEAL SECTIONS (EVITA QUE DESAPAREZCAN) */
function revealRestOfSite() {
  gsap.utils.toArray(".gsap-reveal").forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 95%", // Se activa en cuanto asoma un poco
          toggleActions: "play none none none",
        },
      }
    );
  });
}

/* 7. CLICS DEL NAV */
function initNavClick() {
  document
    .querySelectorAll(".navbar-nav .nav-link, .navbar-brand")
    .forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href");

        let scrollTarget;
        if (targetId === "#master-stage") {
          scrollTarget = 0;
        } else if (targetId === "#services-layer" && window.innerWidth >= 992) {
          scrollTarget = window.innerHeight * 1.2; // Baja al punto de servicios en PC
        } else {
          scrollTarget = document.querySelector(targetId);
        }

        if (lenis) lenis.scrollTo(scrollTarget, { offset: -80 });
        else {
          const top =
            typeof scrollTarget === "number"
              ? scrollTarget
              : scrollTarget.offsetTop - 80;
          window.scrollTo({ top, behavior: "smooth" });
        }

        // Cerrar menú móvil
        const navbarCollapse = document.querySelector(".navbar-collapse");
        if (navbarCollapse.classList.contains("show")) {
          bootstrap.Collapse.getInstance(navbarCollapse).hide();
        }
      });
    });
}

/* 8. ACORDEÓN Y COPIAR */
function initAccordion() {
  document.querySelectorAll(".services-accordion details").forEach((det) => {
    const summary = det.querySelector("summary");
    summary.addEventListener("click", (e) => {
      e.preventDefault();
      const content = det.querySelector(".accordion-content");
      if (!det.hasAttribute("open")) {
        det.setAttribute("open", "");
        gsap.fromTo(
          content,
          { height: 0, opacity: 0 },
          { height: "auto", opacity: 1, duration: 0.4 }
        );
      } else {
        gsap.to(content, {
          height: 0,
          opacity: 0,
          duration: 0.4,
          onComplete: () => det.removeAttribute("open"),
        });
      }
    });
  });
}

function initContactCopy() {
  document.querySelectorAll(".btn-contact-copy").forEach((btn) => {
    btn.addEventListener("click", () => {
      navigator.clipboard.writeText(btn.getAttribute("data-copy-text"));
      const btnText = btn.querySelector(".btn-text");
      const original = btnText.innerText;
      btnText.innerText = "¡Copiado!";
      btn.classList.add("copied");
      setTimeout(() => {
        btnText.innerText = original;
        btn.classList.remove("copied");
      }, 2000);
    });
  });
}

/* --- INICIALIZACIÓN --- */
window.addEventListener("DOMContentLoaded", () => {
  setup3D();
  initNavClick();
  initAccordion();
  initContactCopy();
  intro();
});
