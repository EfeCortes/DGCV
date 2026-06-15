const CONTENT_FILES = {
  general: "contenido/general.md",
  inicio: "contenido/inicio.md",
  carrera: "contenido/carrera.md",
  formacion: "contenido/formacion.md",
  proposito: "contenido/proposito.md",
  admision: "contenido/admision.md",
};

function normalizeKey(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseMarkdown(markdown) {
  const sections = {};
  const blocks = markdown.split(/^##\s+/m).slice(1);

  blocks.forEach((block) => {
    const [heading, ...body] = block.split("\n");
    sections[normalizeKey(heading.trim())] = body.join("\n").trim();
  });

  return sections;
}

function escapeHtml(value) {
  const element = document.createElement("div");
  element.textContent = value;
  return element.innerHTML;
}

function formatText(value, styled = false) {
  let output = escapeHtml(value)
    .replace(/\s{2}\n/g, "<br>")
    .replace(/\n/g, " ");

  if (styled) {
    output = output
      .replace(/\[acento\](.*?)\[\/acento\]/gi, '<span class="word-accent">$1</span>')
      .replace(/\[contorno\](.*?)\[\/contorno\]/gi, '<span class="word-outline">$1</span>');
  }

  return output;
}

function listItems(value) {
  return value
    .split("\n")
    .map((line) => line.replace(/^\s*-\s*/, "").trim())
    .filter(Boolean);
}

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element && value) element.textContent = value;
}

function setHtml(selector, value, styled = false) {
  const element = document.querySelector(selector);
  if (element && value) element.innerHTML = formatText(value, styled);
}

function applyGeneral(content) {
  const navItems = listItems(content.navegacion || "");
  document.querySelectorAll(".main-nav a").forEach((link, index) => {
    if (navItems[index]) link.textContent = navItems[index];
  });

  setText(".header-cta .label", content["boton-del-encabezado"]);
  setHtml(".footer-name", content["nombre-institucional"]);
  setText(".footer-location", content["ubicacion-breve"]);
  setText(".footer-email", content.correo);
  setText(".footer-status", content["estado-del-sitio"]);

  const email = document.querySelector(".footer-email");
  if (email && content.correo) email.href = `mailto:${content.correo}`;
}

function applyInicio(content) {
  setText(".hero-kicker .content-text", content.antetitulo);
  setHtml(".hero h1", content.titular, true);
  setText(".hero-bottom > p", content.descripcion);
  setHtml(".round-link .content-text", content.boton);

  const items = listItems(content.cinta || "");
  const track = document.querySelector(".ticker-track");
  if (track && items.length) {
    const repeated = [...items, ...items];
    track.innerHTML = repeated
      .map((item, index) => `<span>${escapeHtml(item)}</span><i>${index % 2 ? "▲" : "●"}</i>`)
      .join("");
  }
}

function applyCarrera(content) {
  setText("#carrera .section-label .content-text", content.etiqueta);
  setHtml("#carrera h2", content.titular);
  setText("#carrera .lead", content.destacado);
  setText("#carrera .history", content.historia);
  setText("#carrera .text-link .label", content.enlace);
  setText("#carrera .statement .origin", content.origen);
  setHtml("#carrera .statement strong", content.declaracion);
  setText("#carrera .statement .scope", content.alcance);

  const facts = listItems(content.datos || "");
  document.querySelectorAll("#carrera .facts > div").forEach((fact, index) => {
    const [value, label] = (facts[index] || "").split("|").map((part) => part.trim());
    if (value) fact.querySelector("strong").textContent = value;
    if (label) fact.querySelector("span").textContent = label;
  });
}

function applyFormacion(content) {
  setText("#formacion .section-label .content-text", content.etiqueta);
  setHtml("#formacion .section-heading h2", content.titular);
  setText("#formacion .section-heading p", content.introduccion);
  setText("#formacion .source-link .label", content.enlace);

  const areas = listItems(content.areas || "");
  document.querySelectorAll("#formacion .area-card").forEach((card, index) => {
    const [title, description] = (areas[index] || "").split("|").map((part) => part.trim());
    if (title) card.querySelector("h3").textContent = title;
    if (description) card.querySelector("p").textContent = description;
  });
}

function applyProposito(content) {
  setText("#proyectos .section-label .content-text", content.etiqueta);
  setHtml("#proyectos h2", content.titular);
  setText("#proyectos .projects-description", content.descripcion);
  setText("#proyectos .publications-link .label", content["enlace-publicaciones"]);
  setText("#proyectos .institutional-link .label", content["enlace-institucional"]);
  setText("#proyectos .canvas-label", content["estado-de-galeria"]);
  setHtml("#proyectos .project-canvas p", content.galeria);
}

function applyAdmision(content) {
  setText("#admision .section-label .content-text", content.etiqueta);
  setHtml("#admision h2", content.titular);
  setText("#admision .admission-description", content.descripcion);
  setText("#admision .button .label", content.boton);
}

async function loadContent() {
  if (window.location.protocol === "file:") {
    console.info("Para cargar el contenido Markdown, abre iniciar.command.");
    return;
  }

  try {
    const entries = await Promise.all(
      Object.entries(CONTENT_FILES).map(async ([name, file]) => {
        const response = await fetch(`${file}?v=${Date.now()}`);
        if (!response.ok) throw new Error(`No se pudo cargar ${file}`);
        return [name, parseMarkdown(await response.text())];
      })
    );
    const content = Object.fromEntries(entries);

    applyGeneral(content.general);
    applyInicio(content.inicio);
    applyCarrera(content.carrera);
    applyFormacion(content.formacion);
    applyProposito(content.proposito);
    applyAdmision(content.admision);
  } catch (error) {
    console.error("No se pudo cargar el contenido Markdown:", error);
  }
}

loadContent();
