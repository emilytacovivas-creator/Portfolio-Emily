/* ==========================================================================
   Emily Taco · Portfolio
   GSAP Animations (ScrollTrigger + ScrollTo)
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. Plugins + Settings
   -------------------------------------------------------------------------- */
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Respect user preference: reduced motion
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (prefersReducedMotion) {
  // Disable ScrollTrigger-driven animations
  ScrollTrigger.disable();
  // Keep content visible
  gsap.set(".gsap-reveal", { opacity: 1, y: 0, clearProps: "transform" });
}

/* --------------------------------------------------------------------------
   1.5 Smooth Scroll (Lenis) - full page inertia
   -------------------------------------------------------------------------- */
let lenis = null;

if (!prefersReducedMotion) {
  lenis = new Lenis({
    duration: 1.05, // inercia (más alto = más suave)
    smoothWheel: true,
    smoothTouch: false, // si quieres también en móvil, pon true
    wheelMultiplier: 0.9,
  });

  // Lenis RAF
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Sync ScrollTrigger with Lenis
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // Tell ScrollTrigger to use Lenis' scroller position
  ScrollTrigger.scrollerProxy(document.body, {
    scrollTop(value) {
      if (arguments.length) lenis.scrollTo(value, { immediate: true });
      return lenis.scroll;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
  });

  // Refresh everything after setup
  ScrollTrigger.addEventListener("refresh", () => lenis.update());
  ScrollTrigger.refresh();
}

/* --------------------------------------------------------------------------
   2. Helpers
   -------------------------------------------------------------------------- */
const navbar = document.querySelector("#navbar");
const linksToScroll = document.querySelectorAll(
  'a.nav-link[href^="#"], a.btn-accent[href^="#"], a.btn-ghost[href^="#"]'
);

function setNavbarScrolledState() {
  if (!navbar) return;
  const isScrolled = window.scrollY > 10;
  navbar.classList.toggle("is-scrolled", isScrolled);
}

/* --------------------------------------------------------------------------
   3. Hero Intro + Parallax (no-jump)
   -------------------------------------------------------------------------- */
if (!prefersReducedMotion) {
  gsap.set(".hero-card", { opacity: 0, y: 40 });
  gsap.set(".hero-card .gsap-reveal", { opacity: 0, y: 20 });

  const heroTl = gsap.timeline({
    defaults: { ease: "power3.out" },
    onComplete: () => ScrollTrigger.refresh(),
  });

  heroTl
    .to(".hero-card", { opacity: 1, y: 0, duration: 1.1 })
    .to(
      ".hero-card .gsap-reveal",
      { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 },
      "-=0.7"
    );

  // Parallax hero bg
  gsap.to(".hero-bg", {
    y: 80,
    ease: "none",
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "bottom top",
      scrub: 0.6,
      invalidateOnRefresh: true,
    },
  });

  // Parallax hero card (smooth + stable)
  gsap.to(".hero-card", {
    y: 120,
    scale: 0.975,
    ease: "none",
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "bottom top+=140",
      scrub: 0.6,
      invalidateOnRefresh: true,
    },
  });
}

/* --------------------------------------------------------------------------
   4. Section Reveals (grouped stagger)
   -------------------------------------------------------------------------- */
if (!prefersReducedMotion) {
  // Animate reveals per section for a smoother rhythm
  gsap.utils.toArray("section").forEach((section) => {
    // Skip hero: already animated
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
   5. Smooth Scroll (menu + buttons)
   -------------------------------------------------------------------------- */
linksToScroll.forEach((link) => {
  link.addEventListener("click", (e) => {
    const targetId = link.getAttribute("href");
    if (!targetId || !targetId.startsWith("#")) return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    // Close navbar collapse on mobile after click
    const navCollapse = document.querySelector("#navbarNav");
    if (navCollapse && navCollapse.classList.contains("show")) {
      // Bootstrap 5 collapse API
      const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navCollapse);
      bsCollapse.hide();
    }

    /* --------------------------------------------------------------------------
   5. Smooth Scroll (menu + buttons)
   -------------------------------------------------------------------------- */
    linksToScroll.forEach((link) => {
      link.addEventListener("click", (e) => {
        const targetId = link.getAttribute("href");
        if (!targetId || !targetId.startsWith("#")) return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        // Close navbar collapse on mobile after click
        const navCollapse = document.querySelector("#navbarNav");
        if (navCollapse && navCollapse.classList.contains("show")) {
          const bsCollapse =
            bootstrap.Collapse.getOrCreateInstance(navCollapse);
          bsCollapse.hide();
        }

        // Use Lenis if available (best smooth)
        if (lenis) {
          lenis.scrollTo(target, { offset: -90, duration: 1.1 });
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
  });
});

/* --------------------------------------------------------------------------
   6. Navbar Scroll State 
   -------------------------------------------------------------------------- */
setNavbarScrolledState();
window.addEventListener("scroll", setNavbarScrolledState, { passive: true });

/* --------------------------------------------------------------------------
   7. Micro-interactions 
   -------------------------------------------------------------------------- */
if (!prefersReducedMotion) {
  // Button hover lift (subtle)
  const hoverButtons = document.querySelectorAll(".btn-accent, .btn-ghost");
  hoverButtons.forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      gsap.to(btn, { y: -2, duration: 0.2, ease: "power2.out" });
    });
    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, { y: 0, duration: 0.2, ease: "power2.out" });
    });
  });
}
