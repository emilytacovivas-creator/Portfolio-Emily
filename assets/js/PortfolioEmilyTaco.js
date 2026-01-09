/* ==========================================================================
   Emily Taco · Portfolio 
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
  if (!document.querySelector(".tilt-stage")) return;
  gsap.set(".tilt-stage", { perspective: 1600, transformStyle: "preserve-3d" });
  gsap.set("#tiltCard", {
    transformStyle: "preserve-3d",
    transformOrigin: "50% 50%",
    force3D: true,
  });
  gsap.set(".wave-badge", { z: 40 });
  gsap.set(".gsap-reveal", { opacity: 1, y: 0 });
}

/* 3. NAVEGACIÓN ACTIVA */
function updateActiveNav(id) {
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
  navLinks.forEach((link) => {
    link.classList.toggle(
      "active",
      link.getAttribute("href") === id || link.getAttribute("href").includes(id)
    );
  });
}

/* 4. ANIMACIÓN PRINCIPAL (FIX IPAD: CAMBIADO A 1025PX) */
function initMasterScroll() {
  const stage = document.querySelector("#master-stage");
  if (!stage) return;

  ScrollTrigger.matchMedia({
    /* ESCRITORIO (SOLO PANTALLAS GRANDES) - CON PIN */
    "(min-width: 1025px)": function () {
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
    /* TABLET Y MÓVIL (IPAD INCLUIDO) - SIN PIN (SCROLL NORMAL) */
    "(max-width: 1024px)": function () {
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

/* 5. INTRO */
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

/* 6. REVEAL */
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

/* 7. NAV LOGIC */
function initNavLogic() {
  const navbar = document.getElementById("navbar");
  const navCollapse = document.getElementById("navbarNav");
  const navLinks = document.querySelectorAll(
    ".navbar-nav .nav-link, .navbar-brand"
  );

  if (navCollapse && navbar) {
    navCollapse.addEventListener("show.bs.collapse", () => {
      navbar.classList.add("menu-open");
    });
    navCollapse.addEventListener("hide.bs.collapse", () => {
      navbar.classList.remove("menu-open");
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");

      if (targetId.includes("#")) {
        e.preventDefault();
        const pureId = targetId.includes(".html")
          ? targetId.split("#")[1]
          : targetId.replace("#", "");
        const targetElement = document.getElementById(pureId);

        let scrollTarget = 0;
        if (pureId !== "master-stage" && targetElement) {
          scrollTarget = targetElement;
          if (pureId === "services-layer" && window.innerWidth >= 1025) {
            scrollTarget = window.innerHeight * 1.2;
          }
        }

        if (typeof lenis !== "undefined" && lenis) {
          lenis.scrollTo(scrollTarget, { offset: -80 });
        } else {
          const top =
            typeof scrollTarget === "number"
              ? scrollTarget
              : scrollTarget.offsetTop - 80;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }

      if (navCollapse && navCollapse.classList.contains("show")) {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });
}

/* 8. ACORDEÓN */
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

/* 9. COPIAR */
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

/* 10. ERROR 404 */
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

/* --- INIT --- */
window.addEventListener("DOMContentLoaded", () => {
  setup3D();
  initNavLogic();
  initAccordion();
  initContactCopy();
  initErrorPage();
  intro();
});

/* FORM */
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
