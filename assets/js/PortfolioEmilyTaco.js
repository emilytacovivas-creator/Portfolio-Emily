/* ==========================================================================
   Emily Taco · Portfolio
   GSAP + Lenis + Master Stage + Smooth Accordion + Contact Copy + Nav Fixes
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

/* 3. LOGICA MASTER SCROLL (ACTUALIZADO CON MATCHMEDIA) */
function initMasterScroll() {
  ScrollTrigger.refresh();

  // Usamos matchMedia para separar lógica de Móvil vs Escritorio
  ScrollTrigger.matchMedia({
    // --- ESCRITORIO (Pantallas grandes) ---
    "(min-width: 992px)": function () {
      const stage = document.querySelector("#master-stage");
      const card = document.querySelector("#tiltCard");
      const heroText = document.querySelector("#heroText");
      const servicesText = document.querySelector("#servicesText");

      const getMoveRight = () => {
        return window.innerWidth * 0.25;
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: "+=150%", // Pinned duration (150vh)
          scrub: 1,
          pin: true, // ACTIVAMOS PIN SOLO EN ESCRITORIO
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
    },

    // --- MÓVIL Y TABLET (Pantallas pequeñas) ---
    "(max-width: 991px)": function () {
      // Reseteamos propiedades para que se vea normal (sin scroll 3D raro)
      gsap.set("#master-stage", { clearProps: "all" });
      gsap.set("#heroText", { opacity: 1, y: 0 });
      gsap.set("#tiltCard", { opacity: 1, scale: 1, x: 0, rotationY: 0 });
      gsap.set("#servicesText", { opacity: 1, y: 0 });

      // Aquí NO hay pin, permitiendo scroll nativo fluido
    },
  });
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
      initScrollSpy();
      ScrollTrigger.refresh();
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

/* 5. SMOOTH ACCORDION */
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

/* 8. FUNCIONALIDAD COPIAR CONTACTO */
function initContactCopy() {
  const copyButtons = document.querySelectorAll(".btn-contact-copy");

  copyButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const textToCopy = btn.getAttribute("data-copy-text");
      const originalContent = btn.innerHTML;
      const isPhone = btn.id === "btnPhone";
      const successMsg = isPhone ? "Teléfono copiado" : "Email copiado";

      const checkIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ms-2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>`;

      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            btn.classList.add("copied");
            btn.innerHTML = `<span class="btn-text">${successMsg}</span> ${checkIcon}`;
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

/* 9. SMOOTH SCROLL TO ANCHOR (CLICK NAV) */
function initNavClick() {
  const navLinks = document.querySelectorAll(
    ".navbar-nav .nav-link, .navbar-brand"
  );
  const navHeight = 80;

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");

      // Feedback visual inmediato
      document
        .querySelectorAll(".nav-link")
        .forEach((l) => l.classList.remove("active"));
      if (link.classList.contains("nav-link")) link.classList.add("active");

      if (targetId === "#master-stage") {
        if (lenis) lenis.scrollTo(0);
        else window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (targetId === "#services-layer") {
        if (lenis) lenis.scrollTo(window.innerHeight * 1.2);
        else
          window.scrollTo({
            top: window.innerHeight * 1.2,
            behavior: "smooth",
          });
      } else {
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          const offsetTop =
            targetSection.getBoundingClientRect().top +
            window.scrollY -
            navHeight;
          if (lenis) lenis.scrollTo(targetSection, { offset: -navHeight });
          else window.scrollTo({ top: offsetTop, behavior: "smooth" });
        }
      }

      const navbarCollapse = document.querySelector(".navbar-collapse");
      if (navbarCollapse.classList.contains("show")) {
        const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
          toggle: true,
        });
        bsCollapse.hide();
      }
    });
  });
}

/* 10. SCROLL SPY */
function initScrollSpy() {
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

  function setActive(id) {
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href === id) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  // 1. HOME
  ScrollTrigger.create({
    trigger: "body",
    start: "top top",
    end: "+=100vh",
    onEnter: () => setActive("#master-stage"),
    onEnterBack: () => setActive("#master-stage"),
  });

  // 2. SERVICIOS
  ScrollTrigger.create({
    trigger: "body",
    start: "top -80vh",
    end: () =>
      "+=" + document.querySelector("#master-stage").offsetHeight * 1.5,
    onEnter: () => setActive("#services-layer"),
    onEnterBack: () => setActive("#services-layer"),
  });

  // 3. RESTO DE SECCIONES
  const sections = ["#about", "#projects", "#contact"];
  sections.forEach((id) => {
    ScrollTrigger.create({
      trigger: id,
      start: "top 60%",
      end: "bottom 60%",
      onEnter: () => setActive(id),
      onEnterBack: () => setActive(id),
    });
  });
}

/* INIT */
if (!prefersReducedMotion) {
  setup3D();
  initNavClick();
  revealSections();
  microInteractions();
  initAccordion();
  initContactCopy();
  intro();
} else {
  if (lenis) lenis.destroy();
  gsap.set("#tiltCard, .hero-ref-big, .hero-ref-name, .hero-ref-sub", {
    opacity: 1,
    y: 0,
  });
  initNavClick();
  initContactCopy();
  initScrollSpy();
}
