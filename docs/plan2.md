Prompt: "Tengo problemas con el carrusel de mis proyectos en los modales; las imágenes se cortan en pantallas pequeñas. ¿Cómo puedo forzar a que la imagen se adapte siempre al alto de la pantalla sin perder el texto?"

Respuesta de la IA:

Sustituir el CSS del modal por uno basado en max-height: 60vh para la imagen.

Usar object-fit: contain para asegurar que la imagen se vea íntegra.

Asegurar que el modal-body permita scroll independiente para la descripción.

Notas de implementación: Se ajustaron los modales para que funcionen perfectamente
