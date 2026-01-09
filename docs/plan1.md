_Prompt:_ "tengo problemas al realizar una rotacion 3D de una tarjeta. Quiero una sección 'Master Stage' donde una tarjeta central rote en 3D y se transforme al hacer scroll. ¿Cómo gestiono esto con ScrollTrigger?"

Respuesta de la IA:

Configurar un timeline de GSAP vinculado al scroll (scrub: 1).

Usar pin: true para fijar la sección mientras ocurre la transformación.

Aplicar rotationY: -180 a la tarjeta para revelar la cara trasera mientras el texto del Hero desaparece.

Notas de implementación: Se logró la transición fluida entre la Home y Servicios mediante el movimiento de la tarjeta 3D.
