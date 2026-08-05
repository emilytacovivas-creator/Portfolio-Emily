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
  const accordions = [
    ...document.querySelectorAll(".services-accordion details"),
  ];

  accordions.forEach((det) => {
    const summary = det.querySelector("summary");
    const content = det.querySelector(".accordion-content");

    summary.addEventListener("click", (e) => {
      e.preventDefault();

      // Evita conflictos si se pulsa rápidamente varias veces.
      gsap.killTweensOf(content);

      // Si pulsamos el desplegable que ya está abierto, lo cerramos.
      if (det.hasAttribute("open")) {
        gsap.to(content, {
          height: 0,
          opacity: 0,
          duration: 0.45,
          ease: "power2.inOut",
          onComplete: () => {
            det.removeAttribute("open");
            gsap.set(content, {
              clearProps: "height,opacity",
            });
          },
        });

        return;
      }

      // Busca otro desplegable que estuviera abierto.
      const previousOpen = accordions.find(
        (item) => item !== det && item.hasAttribute("open")
      );

      const timeline = gsap.timeline();

      // Cierra suavemente el desplegable anterior.
      if (previousOpen) {
        const previousContent = previousOpen.querySelector(
          ".accordion-content"
        );

        gsap.killTweensOf(previousContent);

        timeline.to(
          previousContent,
          {
            height: 0,
            opacity: 0,
            duration: 0.45,
            ease: "power2.inOut",
            onComplete: () => {
              previousOpen.removeAttribute("open");

              gsap.set(previousContent, {
                clearProps: "height,opacity",
              });
            },
          },
          0
        );
      }

      // Abre suavemente el nuevo desplegable.
      det.setAttribute("open", "");

      gsap.set(content, {
        height: 0,
        opacity: 0,
      });

      timeline.to(
        content,
        {
          height: "auto",
          opacity: 1,
          duration: 0.45,
          ease: "power2.inOut",
          onComplete: () => {
            gsap.set(content, {
              clearProps: "height,opacity",
            });
          },
        },
        0
      );
    });
  });
}
/* 9. LUZ ELÁSTICA DE EXPERIENCIA */
function initExperienceHover() {
  const cards = document.querySelectorAll(".experience-card");

  const supportsHover = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;

  if (prefersReducedMotion || !supportsHover) return;

  cards.forEach((card) => {
    let targetX = 0;
    let targetY = 0;

    let currentX = 0;
    let currentY = 0;

    let previousX = 0;
    let previousY = 0;

    let stretch = 1;
    let squash = 1;
    let angle = 0;

    let animationFrame = null;
    let resetTimer = null;

    function updateBlob() {
      /*
       * La luz avanza hacia el cursor con retraso.
       * Un valor menor produce más inercia.
       */
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12

      /*
       * Calculamos cuánto se ha movido la luz
       * durante este fotograma.
       */
      const velocityX = currentX - previousX;
      const velocityY = currentY - previousY;

      const speed = Math.min(
        Math.hypot(velocityX, velocityY),
        28
      );

      /*
       * Cuanto más rápido se mueve:
       * más se estira horizontalmente
       * y más se comprime verticalmente.
       */
      const targetStretch =
        1 + Math.min(speed * 0.09, 1.2);

      const targetSquash =
        1 - Math.min(speed * 0.024, 0.27);

      /*
       * Suavizamos también la deformación.
       */
      stretch += (targetStretch - stretch) * 0.2;
      squash += (targetSquash - squash) * 0.2;

      /*
       * La masa gira hacia la dirección
       * en la que se está desplazando.
       */
      if (speed > 0.05) {
        const targetAngle =
          Math.atan2(velocityY, velocityX) *
          (180 / Math.PI);

        const angleDifference =
          ((targetAngle - angle + 540) % 360) - 180;

        angle += angleDifference * 0.18;
      }

      card.style.setProperty(
        "--trail-x",
        `${currentX}px`
      );

      card.style.setProperty(
        "--trail-y",
        `${currentY}px`
      );

      card.style.setProperty(
        "--blob-angle",
        `${angle}deg`
      );

      card.style.setProperty(
        "--blob-stretch",
        stretch.toFixed(3)
      );

      card.style.setProperty(
        "--blob-squash",
        squash.toFixed(3)
      );

      previousX = currentX;
      previousY = currentY;

      /*
       * Continúa hasta llegar al cursor
       * y recuperar la forma circular.
       */
      const positionIsMoving =
        Math.abs(targetX - currentX) > 0.1 ||
        Math.abs(targetY - currentY) > 0.1;

      const shapeIsMoving =
        Math.abs(stretch - 1) > 0.002 ||
        Math.abs(squash - 1) > 0.002;

      if (positionIsMoving || shapeIsMoving) {
        animationFrame =
          requestAnimationFrame(updateBlob);
      } else {
        animationFrame = null;
      }
    }

    function startAnimation() {
      if (animationFrame === null) {
        animationFrame =
          requestAnimationFrame(updateBlob);
      }
    }

    card.addEventListener("pointerenter", (event) => {
      clearTimeout(resetTimer);

      const rect = card.getBoundingClientRect();

      targetX = event.clientX - rect.left;
      targetY = event.clientY - rect.top;

      /*
       * Al entrar aparece directamente
       * debajo del cursor.
       */
      currentX = targetX;
      currentY = targetY;

      previousX = currentX;
      previousY = currentY;

      stretch = 1;
      squash = 1;

      card.style.setProperty(
        "--trail-x",
        `${currentX}px`
      );

      card.style.setProperty(
        "--trail-y",
        `${currentY}px`
      );

      card.style.setProperty("--blob-stretch", "1");
      card.style.setProperty("--blob-squash", "1");

      startAnimation();
    });

    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();

      targetX = event.clientX - rect.left;
      targetY = event.clientY - rect.top;

      startAnimation();
    });

    card.addEventListener("pointerleave", () => {
      /*
       * La luz desaparece en la última posición.
       * Después se reinicia sin que se vea.
       */
      resetTimer = setTimeout(() => {
        if (animationFrame !== null) {
          cancelAnimationFrame(animationFrame);
          animationFrame = null;
        }

        const centerX = card.clientWidth / 2;
        const centerY = card.clientHeight / 2;

        targetX = centerX;
        targetY = centerY;

        currentX = centerX;
        currentY = centerY;

        previousX = centerX;
        previousY = centerY;

        stretch = 1;
        squash = 1;
        angle = 0;

        card.style.setProperty("--trail-x", "50%");
        card.style.setProperty("--trail-y", "50%");
        card.style.setProperty("--blob-angle", "0deg");
        card.style.setProperty("--blob-stretch", "1");
        card.style.setProperty("--blob-squash", "1");
      }, 500);
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
  initExperienceHover();
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
