/* ==========================================================================
   Emily Taco · Portfolio
   ========================================================================== */

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.scrollTo(0, 0);

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;


/* ==========================================================================
   1. SCROLL SUAVE · LENIS
   ========================================================================== */

let lenis = null;

if (!prefersReducedMotion && typeof Lenis !== "undefined") {
  lenis = new Lenis({
    lerp: 0.1,
    smoothWheel: true,
  });

  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
}


/* ==========================================================================
   2. HERO · SETUP 3D
   ========================================================================== */

function setup3D() {
  if (!document.querySelector(".tilt-stage")) return;

  gsap.set(".tilt-stage", {
    perspective: 1600,
    transformStyle: "preserve-3d",
  });

  gsap.set("#tiltCard", {
    transformStyle: "preserve-3d",
    transformOrigin: "50% 50%",
    force3D: true,
  });

  gsap.set(".wave-badge", {
    z: 40,
  });

  gsap.set(".gsap-reveal", {
    opacity: 1,
    y: 0,
  });
}


/* ==========================================================================
   3. NAVEGACIÓN ACTIVA
   ========================================================================== */

function updateActiveNav(id) {
  document
    .querySelectorAll(".navbar-nav .nav-link")
    .forEach((link) => {
      const href = link.getAttribute("href") || "";

      link.classList.toggle(
        "active",
        href === id || href.includes(id)
      );
    });
}


/* ==========================================================================
   4. HERO + SERVICIOS · SCROLL RESPONSIVE
   ========================================================================== */

function initMasterScroll() {
  const stage =
    document.querySelector("#master-stage");

  const card =
    document.querySelector("#tiltCard");

  const heroText =
    document.querySelector("#heroText");

  const servicesText =
    document.querySelector("#servicesText");


  if (
    !stage ||
    !card ||
    !heroText ||
    !servicesText
  ) {
    return;
  }


  const mainElements = [
    card,
    heroText,
    servicesText,
  ];


  const heroElements = [
    ".hero-ref-left",
    ".hero-ref-right",
    ".hero-ref-big",
    ".hero-ref-name",
    ".hero-ref-sub",
  ];


  ScrollTrigger.matchMedia({


    /* ======================================================================
       ESCRITORIO
       ====================================================================== */

    "(min-width: 1025px)": function () {

      gsap.set(
        mainElements,
        {
          clearProps:
            "transform,opacity",
        }
      );


      const timeline =
        gsap.timeline({

          scrollTrigger: {

            trigger:
              stage,

            start:
              "top top",

            end:
              "+=150%",

            scrub:
              1,

            pin:
              true,

            onUpdate:
              (self) => {

                updateActiveNav(
                  self.progress > 0.4
                    ? "#services-layer"
                    : "#master-stage"
                );

              },

          },

        });


      timeline

        .to(

          heroText,

          {
            y: -100,
            opacity: 0,
            duration: 1,
          },

          "start"

        )

        .to(

          card,

          {
            rotationY: -180,

            x: () =>
              window.innerWidth * 0.25,

            scale: 0.85,

            duration: 1.5,
          },

          "start"

        )

        .fromTo(

          servicesText,

          {
            y: 100,
            opacity: 0,
          },

          {
            y: 0,
            opacity: 1,
            duration: 1.5,
          },

          "start+=0.2"

        );


      return () => {

        if (
          timeline.scrollTrigger
        ) {
          timeline.scrollTrigger.kill();
        }


        timeline.kill();


        gsap.set(
          mainElements,
          {
            clearProps:
              "transform,opacity",
          }
        );

      };

    },


    /* ======================================================================
       TABLET + MÓVIL
       ====================================================================== */

    "(max-width: 1024px)": function () {

      gsap.set(
        mainElements,
        {
          clearProps:
            "transform,opacity",
        }
      );


      gsap.set(
        heroElements,
        {
          clearProps:
            "transform,opacity,visibility",
        }
      );


      gsap.set(
        heroText,
        {
          opacity: 1,
          y: 0,
        }
      );


      gsap.set(
        heroElements,
        {
          opacity: 1,
          x: 0,
          y: 0,
          visibility: "visible",
        }
      );


      gsap.set(
        card,
        {
          opacity: 1,
          x: 0,
          y: 0,
          rotationY: 0,
          scale: 1,
        }
      );


      gsap.set(
        servicesText,
        {
          opacity: 1,
          x: 0,
          y: 0,
        }
      );


      const servicesTrigger =
        ScrollTrigger.create({

          trigger:
            "#services-layer",

          start:
            "top 20%",

          onToggle:
            (self) => {

              if (
                self.isActive
              ) {

                updateActiveNav(
                  "#services-layer"
                );

              }

            },

        });


      return () => {

        servicesTrigger.kill();


        gsap.set(
          mainElements,
          {
            clearProps:
              "transform,opacity",
          }
        );

      };

    },

  });


  [
    "#about",
    "#projects",
    "#contact",
  ].forEach((id) => {

    if (
      !document.querySelector(id)
    ) {
      return;
    }


    ScrollTrigger.create({

      trigger:
        id,

      start:
        "top 40%",

      end:
        "bottom 40%",

      onEnter:
        () =>
          updateActiveNav(id),

      onEnterBack:
        () =>
          updateActiveNav(id),

    });

  });


  requestAnimationFrame(
    () =>
      ScrollTrigger.refresh()
  );
}


/* ==========================================================================
   5. INTRO DEL HERO
   ========================================================================== */

function intro() {
  const tiltCard =
    document.querySelector("#tiltCard");


  if (!tiltCard) {

    revealRestOfSite();

    return;

  }


  const timeline =
    gsap.timeline({

      onComplete: () => {

        if (lenis) {
          lenis.start();
        }


        initMasterScroll();

        revealRestOfSite();

        ScrollTrigger.refresh();

      },

    });


  timeline

    .fromTo(

      "#tiltCard",

      {
        opacity: 0,
        scale: 0.8,
        y: 50,
      },

      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.2,
        ease: "expo.out",
      }

    )

    .fromTo(

      ".hero-ref-big",

      {
        y: 40,
        opacity: 0,
      },

      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 1,
      },

      "-=0.8"

    )

    .fromTo(

      ".hero-ref-name, .hero-ref-sub",

      {
        opacity: 0,
      },

      {
        opacity: 1,
      },

      "-=0.5"

    )

    .fromTo(

      ".wave-badge",

      {
        scale: 0,
      },

      {
        scale: 1,
        duration: 0.5,
        ease: "back.out",
      },

      "-=0.5"

    );
}


/* ==========================================================================
   6. REVEAL DE SECCIONES
   ========================================================================== */

function revealRestOfSite() {

  gsap.utils
    .toArray(".gsap-reveal")
    .forEach((element) => {

      gsap.fromTo(

        element,

        {
          opacity: 0,
          y: 50,
        },

        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",

          scrollTrigger: {

            trigger:
              element,

            start:
              "top 95%",

            toggleActions:
              "play none none none",

          },

        }

      );

    });

}


/* ==========================================================================
   7. NAVEGACIÓN
   ========================================================================== */

function initNavLogic() {
  const navbar =
    document.getElementById("navbar");

  const navCollapse =
    document.getElementById("navbarNav");

  const navLinks =
    document.querySelectorAll(
      ".navbar-nav .nav-link, .navbar-brand"
    );


  if (
    navbar &&
    navCollapse
  ) {

    navCollapse.addEventListener(
      "show.bs.collapse",
      () => {

        navbar.classList.add(
          "menu-open"
        );

      }
    );


    navCollapse.addEventListener(
      "hide.bs.collapse",
      () => {

        navbar.classList.remove(
          "menu-open"
        );

      }
    );

  }


  navLinks.forEach((link) => {

    link.addEventListener(
      "click",
      (event) => {

        const targetId =
          link.getAttribute("href") || "";


        if (
          targetId.includes("#")
        ) {

          event.preventDefault();


          const pureId =
            targetId.includes(".html")
              ? targetId.split("#")[1]
              : targetId.replace("#", "");


          const targetElement =
            document.getElementById(
              pureId
            );


          let scrollTarget = 0;


          if (
            pureId !== "master-stage" &&
            targetElement
          ) {

            scrollTarget =
              targetElement;


            if (
              pureId === "services-layer" &&
              window.innerWidth >= 1025
            ) {

              scrollTarget =
                window.innerHeight * 1.2;

            }

          }


          if (lenis) {

            lenis.scrollTo(
              scrollTarget,
              {
                offset: -80,
              }
            );

          } else {

            const top =
              typeof scrollTarget ===
              "number"
                ? scrollTarget
                : scrollTarget.offsetTop -
                  80;


            window.scrollTo({

              top,

              behavior:
                "smooth",

            });

          }

        }


        if (
          navCollapse?.classList.contains(
            "show"
          )
        ) {

          bootstrap.Collapse
            .getInstance(
              navCollapse
            )
            ?.hide();

        }

      }
    );

  });
}


/* ==========================================================================
   8. ACORDEÓN DE SERVICIOS
   ========================================================================== */

function initAccordion() {

  const accordions = [
    ...document.querySelectorAll(
      ".services-accordion details"
    ),
  ];


  accordions.forEach(
    (details) => {

      const summary =
        details.querySelector(
          "summary"
        );

      const content =
        details.querySelector(
          ".accordion-content"
        );


      if (
        !summary ||
        !content
      ) {
        return;
      }


      summary.addEventListener(
        "click",
        (event) => {

          event.preventDefault();


          gsap.killTweensOf(
            content
          );


          /* CERRAR EL ACTUAL */

          if (
            details.hasAttribute(
              "open"
            )
          ) {

            gsap.to(
              content,
              {

                height: 0,
                opacity: 0,

                duration: 0.45,

                ease:
                  "power2.inOut",

                onComplete: () => {

                  details.removeAttribute(
                    "open"
                  );


                  gsap.set(
                    content,
                    {
                      clearProps:
                        "height,opacity",
                    }
                  );

                },

              }
            );


            return;

          }


          /* CERRAR OTRO ACORDEÓN ABIERTO */

          const previousOpen =
            accordions.find(

              (item) =>
                item !== details &&
                item.hasAttribute(
                  "open"
                )

            );


          const timeline =
            gsap.timeline();


          if (previousOpen) {

            const previousContent =
              previousOpen.querySelector(
                ".accordion-content"
              );


            if (previousContent) {

              gsap.killTweensOf(
                previousContent
              );


              timeline.to(

                previousContent,

                {
                  height: 0,
                  opacity: 0,

                  duration: 0.45,

                  ease:
                    "power2.inOut",

                  onComplete: () => {

                    previousOpen
                      .removeAttribute(
                        "open"
                      );


                    gsap.set(
                      previousContent,
                      {
                        clearProps:
                          "height,opacity",
                      }
                    );

                  },

                },

                0

              );

            }

          }


          /* ABRIR EL NUEVO */

          details.setAttribute(
            "open",
            ""
          );


          gsap.set(
            content,
            {
              height: 0,
              opacity: 0,
            }
          );


          timeline.to(

            content,

            {
              height: "auto",
              opacity: 1,

              duration: 0.45,

              ease:
                "power2.inOut",

              onComplete: () => {

                gsap.set(
                  content,
                  {
                    clearProps:
                      "height,opacity",
                  }
                );

              },

            },

            0

          );

        }
      );

    }
  );

}


/* ==========================================================================
   9. EXPERIENCIA · LUZ ELÁSTICA
   ========================================================================== */

function initExperienceHover() {

  const supportsHover =
    window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;


  if (
    prefersReducedMotion ||
    !supportsHover
  ) {
    return;
  }


  document
    .querySelectorAll(
      ".experience-card"
    )
    .forEach((card) => {

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


      const setPosition = () => {

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

      };


      function updateBlob() {

        currentX +=
          (targetX - currentX) *
          0.12;

        currentY +=
          (targetY - currentY) *
          0.12;


        const velocityX =
          currentX -
          previousX;

        const velocityY =
          currentY -
          previousY;


        const speed =
          Math.min(
            Math.hypot(
              velocityX,
              velocityY
            ),
            28
          );


        const targetStretch =
          1 +
          Math.min(
            speed * 0.09,
            1.2
          );


        const targetSquash =
          1 -
          Math.min(
            speed * 0.024,
            0.27
          );


        stretch +=
          (targetStretch -
            stretch) *
          0.2;


        squash +=
          (targetSquash -
            squash) *
          0.2;


        if (
          speed > 0.05
        ) {

          const targetAngle =
            Math.atan2(
              velocityY,
              velocityX
            ) *
            (180 / Math.PI);


          const angleDifference =
            (
              (
                targetAngle -
                angle +
                540
              ) %
              360
            ) -
            180;


          angle +=
            angleDifference *
            0.18;

        }


        setPosition();


        previousX =
          currentX;

        previousY =
          currentY;


        const positionIsMoving =
          Math.abs(
            targetX -
              currentX
          ) >
            0.1 ||
          Math.abs(
            targetY -
              currentY
          ) >
            0.1;


        const shapeIsMoving =
          Math.abs(
            stretch - 1
          ) >
            0.002 ||
          Math.abs(
            squash - 1
          ) >
            0.002;


        if (
          positionIsMoving ||
          shapeIsMoving
        ) {

          animationFrame =
            requestAnimationFrame(
              updateBlob
            );

        } else {

          animationFrame =
            null;

        }

      }


      function startAnimation() {

        if (
          animationFrame ===
          null
        ) {

          animationFrame =
            requestAnimationFrame(
              updateBlob
            );

        }

      }


      card.addEventListener(
        "pointerenter",
        (event) => {

          clearTimeout(
            resetTimer
          );


          const rect =
            card.getBoundingClientRect();


          targetX =
            event.clientX -
            rect.left;

          targetY =
            event.clientY -
            rect.top;


          currentX =
            targetX;

          currentY =
            targetY;


          previousX =
            currentX;

          previousY =
            currentY;


          stretch = 1;
          squash = 1;


          card.style.setProperty(
            "--blob-stretch",
            "1"
          );

          card.style.setProperty(
            "--blob-squash",
            "1"
          );


          setPosition();

          startAnimation();

        }
      );


      card.addEventListener(
        "pointermove",
        (event) => {

          const rect =
            card.getBoundingClientRect();


          targetX =
            event.clientX -
            rect.left;

          targetY =
            event.clientY -
            rect.top;


          startAnimation();

        }
      );


      card.addEventListener(
        "pointerleave",
        () => {

          resetTimer =
            setTimeout(
              () => {

                if (
                  animationFrame !==
                  null
                ) {

                  cancelAnimationFrame(
                    animationFrame
                  );

                  animationFrame =
                    null;

                }


                const centerX =
                  card.clientWidth /
                  2;

                const centerY =
                  card.clientHeight /
                  2;


                targetX =
                  centerX;

                targetY =
                  centerY;

                currentX =
                  centerX;

                currentY =
                  centerY;

                previousX =
                  centerX;

                previousY =
                  centerY;


                stretch = 1;
                squash = 1;
                angle = 0;


                card.style.setProperty(
                  "--trail-x",
                  "50%"
                );

                card.style.setProperty(
                  "--trail-y",
                  "50%"
                );

                card.style.setProperty(
                  "--blob-angle",
                  "0deg"
                );

                card.style.setProperty(
                  "--blob-stretch",
                  "1"
                );

                card.style.setProperty(
                  "--blob-squash",
                  "1"
                );

              },

              500

            );

        }
      );

    });

}


/* ==========================================================================
   10. CONTACTO · COPIAR DATOS
   ========================================================================== */

function initContactCopy() {

  document
    .querySelectorAll(
      ".btn-contact-copy"
    )
    .forEach((button) => {

      button.addEventListener(
        "click",
        () => {

          const textToCopy =
            button.getAttribute(
              "data-copy-text"
            );


          const buttonText =
            button.querySelector(
              ".btn-text"
            );


          if (
            !textToCopy ||
            !buttonText
          ) {
            return;
          }


          navigator.clipboard
            .writeText(
              textToCopy
            );


          const originalText =
            buttonText.innerText;


          buttonText.innerText =
            "¡Copiado!";


          button.classList.add(
            "copied"
          );


          setTimeout(
            () => {

              buttonText.innerText =
                originalText;


              button.classList.remove(
                "copied"
              );

            },

            2000

          );

        }
      );

    });

}


/* ==========================================================================
   11. PÁGINA 404
   ========================================================================== */

function initErrorPage() {

  const errorContainer =
    document.querySelector(
      ".error-container"
    );


  if (!errorContainer) {
    return;
  }


  gsap.from(
    errorContainer,
    {

      opacity: 0,

      y: 30,

      duration: 1,

      ease:
        "power2.out",

    }
  );


  gsap.to(
    ".gsap-reveal",
    {

      opacity: 1,

      y: 0,

      duration: 1,

      delay: 0.5,

    }
  );

}


/* ==========================================================================
   12. MODALES DE PROYECTOS
   ========================================================================== */

function initProjectModals() {

  document
    .querySelectorAll(
      ".modal"
    )
    .forEach((modal) => {

      const modalBody =
        modal.querySelector(
          ".modal-body"
        );


      const carouselElement =
        modal.querySelector(
          ".project-modal-carousel"
        );


      const modalVideos =
        modal.querySelectorAll(
          ".project-carousel-video"
        );


      if (modalBody) {

        modalBody.setAttribute(
          "data-lenis-prevent",
          ""
        );

      }


      /* ====================================================================
         CONTROLES DE VÍDEO
         ==================================================================== */

      modalVideos.forEach(
        (video) => {

          const wrapper =
            video.closest(
              ".project-video-wrapper"
            );


          const toggleButton =
            wrapper?.querySelector(
              ".project-video-toggle"
            );


          if (!toggleButton) {
            return;
          }


          const updateVideoButton =
            () => {

              const isPlaying =
                !video.paused &&
                !video.ended;


              toggleButton
                .classList
                .toggle(
                  "is-playing",
                  isPlaying
                );


              toggleButton.setAttribute(

                "aria-label",

                isPlaying
                  ? "Pausar vídeo"
                  : "Reproducir vídeo"

              );

            };


          toggleButton.addEventListener(

            "click",

            (event) => {

              event.preventDefault();

              event.stopPropagation();


              if (
                video.paused
              ) {

                video.play();

              } else {

                video.pause();

              }

            }

          );


          [
            "play",
            "pause",
            "ended",
          ].forEach(
            (eventName) => {

              video.addEventListener(
                eventName,
                updateVideoButton
              );

            }
          );


          updateVideoButton();

        }
      );


      /* ====================================================================
         RUEDA FUERA DEL BODY DEL MODAL
         ==================================================================== */

      modal.addEventListener(

        "wheel",

        (event) => {

          if (
            !modalBody ||
            event.target.closest(
              ".modal-body"
            )
          ) {
            return;
          }


          event.preventDefault();


          modalBody.scrollTop +=
            event.deltaY;

        },

        {
          passive: false,
        }

      );


      /* ====================================================================
         APERTURA
         ==================================================================== */

      modal.addEventListener(
        "show.bs.modal",
        () => {

          if (lenis) {
            lenis.stop();
          }

        }
      );


      modal.addEventListener(
        "shown.bs.modal",
        () => {

          if (modalBody) {

            modalBody.scrollTop =
              0;

          }


          if (!carouselElement) {
            return;
          }


          const carousel =
            bootstrap.Carousel
              .getOrCreateInstance(

                carouselElement,

                {
                  interval: false,
                  pause: true,
                  touch: true,
                  wrap: true,
                }

              );


          carousel.pause();

        }
      );


      /* ====================================================================
         CAMBIO DE SLIDE
         ==================================================================== */

      if (carouselElement) {

        carouselElement
          .addEventListener(

            "slide.bs.carousel",

            () => {

              modalVideos.forEach(
                (video) =>
                  video.pause()
              );

            }

          );

      }


      /* ====================================================================
         CIERRE
         ==================================================================== */

      modal.addEventListener(
        "hide.bs.modal",
        () => {

          modalVideos.forEach(
            (video) =>
              video.pause()
          );


          if (!carouselElement) {
            return;
          }


          bootstrap.Carousel
            .getInstance(
              carouselElement
            )
            ?.pause();

        }
      );


      modal.addEventListener(
        "hidden.bs.modal",
        () => {

          if (
            carouselElement
          ) {

            const carousel =
              bootstrap.Carousel
                .getInstance(
                  carouselElement
                );


            if (carousel) {

              carousel.to(0);

              carousel.pause();

            }

          }


          modalVideos.forEach(
            (video) => {

              video.pause();


              try {

                video.currentTime =
                  0;

              } catch {

                /*
                 * Puede ocurrir si el navegador
                 * aún no ha cargado los metadatos.
                 */

              }

            }
          );


          if (lenis) {
            lenis.start();
          }

        }
      );

    });

}


/* ==========================================================================
   FOTOGRAFÍA · CARRUSEL 3D
   ========================================================================== */

function initPhotographyCarousel() {

  const carousel =
    document.querySelector(
      ".photography-carousel"
    );


  if (!carousel) {
    return;
  }


  const stage =
    carousel.querySelector(
      ".photography-carousel-stage"
    );


  const slides = [
    ...carousel.querySelectorAll(
      ".photography-slide"
    ),
  ];


  const previousButton =
    document.querySelector(
      ".photography-prev"
    );


  const nextButton =
    document.querySelector(
      ".photography-next"
    );


  const currentCounter =
    document.querySelector(
      ".photography-current"
    );


  if (
    !stage ||
    slides.length < 2
  ) {
    return;
  }


  const total =
    slides.length;


  const reduceMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  let activeIndex = 0;

  let autoplayTimer = null;

  let isVisible = true;

  let isInteracting = false;

  let pointerStartX = null;



  /* ========================================================================
     POSICIÓN RELATIVA
     ======================================================================== */

  function getRelativePosition(index) {

    let position =
      index -
      activeIndex;


    const half =
      Math.floor(
        total / 2
      );


    if (
      position > half
    ) {

      position -=
        total;

    }


    if (
      position < -half
    ) {

      position +=
        total;

    }


    return position;

  }



  /* ========================================================================
     ESTADO VISUAL
     ======================================================================== */

  function getVisualState(position) {

    const distance =
      Math.abs(position);


    const stageWidth =
      stage.clientWidth;


    const isMobile =
      window.innerWidth <= 767;


    const spacing =
      isMobile

        ? Math.min(
            stageWidth * 0.48,
            210
          )

        : Math.min(
            stageWidth * 0.27,
            360
          );


    if (
      distance === 0
    ) {

      return {

        x:
          0,

        y:
          0,

        z:
          0,

        scale:
          1,

        rotationY:
          0,

        opacity:
          1,

        filter:
          "blur(0px) brightness(1) saturate(1)",

        zIndex:
          10,

      };

    }


    if (
      distance === 1
    ) {

      return {

        x:
          position *
          spacing,

        y:
          20,

        z:
          -120,

        scale:
          0.8,

        rotationY:
          position *
          -7,

        opacity:
          0.72,

        filter:
          "blur(2.5px) brightness(0.82) saturate(0.9)",

        zIndex:
          5,

      };

    }


    return {

      x:
        position *
        spacing,

      y:
        46,

      z:
        -230,

      scale:
        0.63,

      rotationY:
        position *
        -10,

      opacity:
        0.32,

      filter:
        "blur(7px) brightness(0.68) saturate(0.72)",

      zIndex:
        2,

    };

  }



  /* ========================================================================
     ACTUALIZAR CARRUSEL
     ======================================================================== */

  function renderCarousel(
    animate = true
  ) {

    slides.forEach(
      (
        slide,
        index
      ) => {

        const position =
          getRelativePosition(
            index
          );


        const previousPosition =
          Number(
            slide.dataset.position ??
            position
          );


        const state =
          getVisualState(
            position
          );


        const isLoopJump =
          Math.abs(
            previousPosition -
            position
          ) > 2;


        slide.dataset.position =
          position;


        slide.classList.toggle(
          "is-active",
          position === 0
        );


        slide.setAttribute(
          "aria-hidden",
          position === 0
            ? "false"
            : "true"
        );


        const duration =
          animate &&
          !reduceMotion
            ? 1.15
            : 0;


        /*
         * Cuando una imagen salta del extremo
         * derecho al izquierdo del loop,
         * la recolocamos mientras está oculta.
         *
         * Así nunca atraviesa todo el carrusel.
         */

        if (
          isLoopJump &&
          animate &&
          !reduceMotion
        ) {

          gsap.set(
            slide,
            {

              xPercent:
                -50,

              yPercent:
                -50,

              x:
                state.x,

              y:
                state.y,

              z:
                state.z,

              scale:
                state.scale,

              rotationY:
                state.rotationY,

              opacity:
                0,

              filter:
                state.filter,

              zIndex:
                state.zIndex,

            }
          );


          gsap.to(
            slide,
            {

              opacity:
                state.opacity,

              duration:
                0.55,

              delay:
                0.3,

              ease:
                "power2.out",

              overwrite:
                true,

            }
          );


          return;

        }


        gsap.to(
          slide,
          {

            xPercent:
              -50,

            yPercent:
              -50,

            x:
              state.x,

            y:
              state.y,

            z:
              state.z,

            scale:
              state.scale,

            rotationY:
              state.rotationY,

            opacity:
              state.opacity,

            filter:
              state.filter,

            zIndex:
              state.zIndex,

            duration,

            ease:
              "power4.inOut",

            overwrite:
              true,

          }
        );

      }
    );


    if (
      currentCounter
    ) {

      currentCounter.textContent =
        String(
          activeIndex + 1
        ).padStart(
          2,
          "0"
        );

    }

  }



  /* ========================================================================
     CAMBIAR FOTOGRAFÍA
     ======================================================================== */

  function moveCarousel(
    direction
  ) {

    activeIndex =
      (
        activeIndex +
        direction +
        total
      ) %
      total;


    renderCarousel(
      true
    );

  }



  /* ========================================================================
     AUTOPLAY
     ======================================================================== */

  function stopAutoplay() {

    if (
      autoplayTimer
    ) {

      clearInterval(
        autoplayTimer
      );


      autoplayTimer =
        null;

    }

  }


  function startAutoplay() {

    stopAutoplay();


    if (
      reduceMotion ||
      !isVisible ||
      isInteracting
    ) {
      return;
    }


    autoplayTimer =
      setInterval(
        () => {

          moveCarousel(
            1
          );

        },

        4200

      );

  }


  function restartAutoplay() {

    stopAutoplay();

    startAutoplay();

  }



  /* ========================================================================
     FLECHAS
     ======================================================================== */

  previousButton?.addEventListener(
    "click",
    () => {

      moveCarousel(
        -1
      );

      restartAutoplay();

    }
  );


  nextButton?.addEventListener(
    "click",
    () => {

      moveCarousel(
        1
      );

      restartAutoplay();

    }
  );



  /* ========================================================================
     CLICK EN FOTOGRAFÍA LATERAL
     ======================================================================== */

  slides.forEach(
    (
      slide,
      index
    ) => {

      slide.addEventListener(
        "click",
        () => {

          if (
            index ===
            activeIndex
          ) {
            return;
          }


          activeIndex =
            index;


          renderCarousel(
            true
          );


          restartAutoplay();

        }
      );

    }
  );



  /* ========================================================================
     PAUSAR AL INTERACTUAR
     ======================================================================== */

  carousel.addEventListener(
    "mouseenter",
    () => {

      isInteracting =
        true;

      stopAutoplay();

    }
  );


  carousel.addEventListener(
    "mouseleave",
    () => {

      isInteracting =
        false;

      startAutoplay();

    }
  );


  carousel.addEventListener(
    "focusin",
    () => {

      isInteracting =
        true;

      stopAutoplay();

    }
  );


  carousel.addEventListener(
    "focusout",
    () => {

      isInteracting =
        false;

      startAutoplay();

    }
  );



  /* ========================================================================
     SWIPE EN MÓVIL
     ======================================================================== */

  stage.addEventListener(
    "pointerdown",
    (event) => {

      pointerStartX =
        event.clientX;

    }
  );


  stage.addEventListener(
    "pointerup",
    (event) => {

      if (
        pointerStartX ===
        null
      ) {
        return;
      }


      const difference =
        event.clientX -
        pointerStartX;


      pointerStartX =
        null;


      if (
        Math.abs(
          difference
        ) < 45
      ) {
        return;
      }


      moveCarousel(
        difference < 0
          ? 1
          : -1
      );


      restartAutoplay();

    }
  );



  /* ========================================================================
     PAUSAR CUANDO NO ESTÁ EN PANTALLA
     ======================================================================== */

  const observer =
    new IntersectionObserver(

      (
        entries
      ) => {

        isVisible =
          entries[0]
            .isIntersecting;


        if (
          isVisible
        ) {

          startAutoplay();

        } else {

          stopAutoplay();

        }

      },

      {
        threshold:
          0.25,
      }

    );


  observer.observe(
    carousel
  );



  /* ========================================================================
     RESPONSIVE
     ======================================================================== */

  let resizeTimer;


  window.addEventListener(
    "resize",
    () => {

      clearTimeout(
        resizeTimer
      );


      resizeTimer =
        setTimeout(
          () => {

            renderCarousel(
              false
            );

          },

          120

        );

    }
  );



  /* ========================================================================
     INICIO
     ======================================================================== */

  renderCarousel(
    false
  );

}

/* ==========================================================================
   13. INICIALIZACIÓN
   ========================================================================== */

window.addEventListener(
  "DOMContentLoaded",
  () => {

    setup3D();

    initNavLogic();

    initAccordion();

    initExperienceHover();

    initContactCopy();

    initErrorPage();

    initProjectModals();
    
    initPhotographyCarousel();

    intro();

  }
);