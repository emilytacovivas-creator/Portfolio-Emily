/* ==========================================================================
   Emily Taco · Portfolio 
   ========================================================================== */

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Forzar el scroll al inicio al recargar
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
window.scrollTo(0, 0);

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/* 1. LENIS (Smooth Scroll) */
let lenis = null;
if (!prefersReducedMotion && typeof Lenis !== "undefined") {
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
}

/* 2. SETUP 3D (Efecto Tilt de la tarjeta) */
function setup3D() {
  if (!document.querySelector(".tilt-stage")) return;
  gsap.set(".tilt-stage", { perspective: 1600, transformStyle: "preserve-3d" });
  gsap.set("#tiltCard", {
    transformStyle: "preserve-3d",
    transformOrigin: "50% 50%",
    force3D: true,
  });
  gsap.set(".wave-badge", { z: 40 });
}

/* 3. NAVEGACIÓN ACTIVA (Scrollspy personalizado) */
function updateActiveNav(id) {
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
  navLinks.forEach((link) => {
    link.classList.toggle(
      "active",
      link.getAttribute("href") === id || link.getAttribute("href").includes(id)
    );
  });
}

/* 4. ANIMACIÓN PRINCIPAL (HOME -> SERVICIOS) */
function initMasterScroll() {
  const stage = document.querySelector("#master-stage");
  if (!stage) return;

  ScrollTrigger.matchMedia({
    "(min-width: 992px)": function () {
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
      ScrollTrigger.create({
        trigger: "#services-layer",
        start: "top 20%",
        onToggle: (self) => self.isActive && updateActiveNav("#services-layer"),
      });
    },
  });

  ["#about", "#projects", "#contact"].forEach((id) => {
    const el = document.querySelector(id);
    if (el) {
      ScrollTrigger.create({
        trigger: id,
        start: "top 40%",
        end: "bottom 40%",
        onEnter: () => updateActiveNav(id),
        onEnterBack: () => updateActiveNav(id),
      });
    }
  });
}

/* 5. ANIMACIÓN DE ENTRADA (Intro) */
function intro() {
  const tiltCard = document.querySelector("#tiltCard");
  if (!tiltCard) {
    revealRestOfSite();
    return;
  }

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

/* 6. REVELAR SECCIONES AL HACER SCROLL */
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
          start: "top 95%",
          toggleActions: "play none none none",
        },
      }
    );
  });
}

/* 7. CLICS DEL NAVBAR (Smooth scroll manual) */
function initNavClick() {
  document
    .querySelectorAll(".navbar-nav .nav-link, .navbar-brand")
    .forEach((link) => {
      link.addEventListener("click", (e) => {
        const targetId = link.getAttribute("href");
        if (targetId.includes(".html") && !targetId.includes("#")) return;

        e.preventDefault();
        const pureId = targetId.includes("#")
          ? targetId.split("#")[1]
          : targetId;
        const targetElement = document.getElementById(pureId);

        let scrollTarget;
        if (pureId === "master-stage") {
          scrollTarget = 0;
        } else if (
          pureId === "services-layer" &&
          window.innerWidth >= 992 &&
          document.querySelector("#master-stage")
        ) {
          scrollTarget = window.innerHeight * 1.2;
        } else if (targetElement) {
          scrollTarget = targetElement;
        } else {
          window.location.href = targetId;
          return;
        }

        if (lenis) lenis.scrollTo(scrollTarget, { offset: -80 });
        else {
          const top =
            typeof scrollTarget === "number"
              ? scrollTarget
              : scrollTarget.offsetTop - 80;
          window.scrollTo({ top, behavior: "smooth" });
        }

        const navbarCollapse = document.querySelector(".navbar-collapse");
        if (navbarCollapse && navbarCollapse.classList.contains("show")) {
          bootstrap.Collapse.getInstance(navbarCollapse).hide();
        }
      });
    });
}

/* 8. ACORDEÓN DE SERVICIOS */
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

/* 9. FUNCIÓN COPIAR AL PORTAPAPELES (Nuevos botones debajo del teléfono) */
function initContactCopy() {
  document.querySelectorAll(".btn-contact-copy").forEach((btn) => {
    btn.addEventListener("click", () => {
      const textToCopy = btn.getAttribute("data-copy-text");
      navigator.clipboard.writeText(textToCopy);

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

/* 10. LÓGICA PÁGINA 404 */
function initErrorPage() {
  const errorContainer = document.querySelector(".error-container");
  if (errorContainer) {
    gsap.from(errorContainer, {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: "power2.out",
    });
    gsap.to(".gsap-reveal", { opacity: 1, y: 0, duration: 1, delay: 0.5 });
  }
}

/* --- INICIALIZACIÓN GENERAL --- */
window.addEventListener("DOMContentLoaded", () => {
  setup3D();
  initNavClick();
  initAccordion();
  initContactCopy();
  initErrorPage();
  intro();
});

/* --- FUNCIONALIDAD FORMULARIO DE CONTACTO (SIMULADO) --- */
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const submitBtn = document.getElementById("submitBtn");
    const formFeedback = document.getElementById("formFeedback");

    submitBtn.innerText = "Enviando...";
    submitBtn.disabled = true;

    setTimeout(() => {
      contactForm.reset();
      submitBtn.innerText = "Enviar mensaje";
      submitBtn.disabled = false;
      formFeedback.classList.remove("d-none");

      setTimeout(() => {
        formFeedback.classList.add("d-none");
      }, 5000);
    }, 1500);
  });
}
