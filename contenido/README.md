# Cómo editar el contenido

Los textos visibles del sitio están separados por sección:

- `general.md`: navegación, botones y pie de página.
- `inicio.md`: portada.
- `licenciatura.md`: carrera, admisión, titulación y datos académicos.
- `investigacion.md`: investigación formal, formativa, de carrera y CIDIS.
- `interaccion.md`: prácticas preprofesionales y laboratorio.
- `posgrado.md`: oferta de diplomados.
- `contacto.md`: ubicación, redes, número y correo.

Las traducciones al quechua boliviano están dentro de la carpeta `qu/` y
conservan la misma estructura y nombres de archivo.

## Reglas sencillas

1. Conserva los títulos que comienzan con `##`, porque identifican cada texto.
2. Puedes cambiar libremente el contenido situado debajo de cada título.
3. En las listas, conserva el separador `|`.
4. En el titular de portada, `[acento]` aplica el color lila y `[contorno]` crea texto delineado.
5. Dos espacios al final de una línea producen un salto de línea.
6. Guarda el archivo y recarga la web para ver el cambio.

Después de editar textos, ejecuta `node generate-content.js` para actualizar el
paquete bilingüe y recarga la web. Para abrirla, usa `iniciar.command`.
