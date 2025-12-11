gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Animación de entrada del hero
gsap.from(".hero-card", {
  opacity: 0,
  y: 40,
  duration: 1.1,
  ease: "power3.out",
});

gsap.from(".hero-card .gsap-reveal", {
  opacity: 0,
  y: 20,
  duration: 0.9,
  ease: "power3.out",
  delay: 0.25,
  stagger: 0.12,
});

// Efecto tarjeta que baja con el scroll (parallax suave)
gsap.to(".hero-card", {
  scrollTrigger: {
    trigger: "#hero",
    start: "top top",
    end: "bottom top+=120",
    scrub: true,
  },
  y: 120,
  scale: 0.97,
  ease: "none",
});

// Fade-up para el resto de elementos gsap-reveal
gsap.utils.toArray(".gsap-reveal").forEach((el) => {
  // los del hero ya se animan arriba
  if (el.closest("#hero")) return;

  gsap.fromTo(
    el,
    { opacity: 0, y: 26 },
    {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
      },
    }
  );
});

// Scroll suave del menú
document
  .querySelectorAll(
    'a.nav-link[href^="#"], a.btn-accent[href^="#"], a.btn-ghost[href^="#"]'
  )
  .forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (!targetId || !targetId.startsWith("#")) return;

      e.preventDefault();
      const target = document.querySelector(targetId);
      if (!target) return;

      gsap.to(window, {
        duration: 0.9,
        scrollTo: { y: target, offsetY: 80 },
        ease: "power3.out",
      });
    });
  });
