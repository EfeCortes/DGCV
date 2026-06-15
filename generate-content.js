const fs = require("fs");
const path = require("path");

const root = __dirname;
const files = [
  "general.md",
  "inicio.md",
  "licenciatura.md",
  "investigacion.md",
  "interaccion.md",
  "posgrado.md",
  "contacto.md",
];

function readLanguage(folder) {
  return Object.fromEntries(
    files.map((file) => [
      path.basename(file, ".md"),
      fs.readFileSync(path.join(root, "contenido", folder, file), "utf8"),
    ])
  );
}

const content = {
  es: readLanguage("."),
  qu: readLanguage("qu"),
};

fs.writeFileSync(
  path.join(root, "content-data.js"),
  `window.DGCV_CONTENT = ${JSON.stringify(content, null, 2)};\n`
);
