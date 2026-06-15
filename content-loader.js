const CONTENT_FILES = {
  general: "general.md",
  inicio: "inicio.md",
  licenciatura: "licenciatura.md",
  investigacion: "investigacion.md",
  interaccion: "interaccion.md",
  posgrado: "posgrado.md",
  contacto: "contacto.md",
};

const UI_TEXT = {
  es: {
    menu: "Menú",
    languageLabel: "Seleccionar idioma",
    purposeLabel: "Nuestra orientación",
    mission: "Misión",
    vision: "Visión",
    objectives: "Objetivos",
    degreeCards: ["¿Qué es la carrera?", "¿Qué hace la carrera?", "Modalidades de admisión", "Modalidades de titulación"],
    researchCards: ["Investigación formal", "Investigación formativa", "Investigación de la carrera", "Investigación del CIDIS"],
    interactionCards: ["Prácticas preprofesionales", "Laboratorio"],
    heroAlt: "Estudiante de Diseño Gráfico trabajando en una tableta gráfica",
  },
  qu: {
    menu: "Akllana",
    languageLabel: "Simita akllay",
    purposeLabel: "Ñanninchik",
    mission: "Ruwayninchik",
    vision: "Qhawariyninchik",
    objectives: "Munasqanchik",
    degreeCards: ["¿Imataq kay carrera?", "¿Imatataq carrera ruwan?", "Yaykunapaq ñankuna", "Titulación nisqapa ñankuna"],
    researchCards: ["Allin wakichisqa yachay mask'ay", "Yachachiq yachay mask'ay", "Carrerapa yachay mask'aynin", "CIDISpa yachay mask'aynin"],
    interactionCards: ["Profesión ñawpaq prácticas", "Laboratorio"],
    heroAlt: "Diseño Gráfico yachakuq tableta gráficapi llamk'achkan",
  },
};

function readSavedLanguage() {
  try {
    return window.localStorage.getItem("dgcv-language");
  } catch {
    return null;
  }
}

function saveLanguage(language) {
  try {
    window.localStorage.setItem("dgcv-language", language);
  } catch {
    // The language switch still works when browser storage is unavailable.
  }
}

let currentLanguage = readSavedLanguage() || "es";
const contentCache = {};

const normalizeKey = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const SOFT_HYPHEN = "\u00ad";
const QUECHUA_DIGRAPHS = new Set(["ch", "ll", "ph", "th", "kh", "qh", "sh"]);
const QUECHUA_VOWELS = /[aeiouáéíóúü]/i;

function quechuaGraphemes(word) {
  const letters = Array.from(word);
  const graphemes = [];

  for (let index = 0; index < letters.length; index += 1) {
    let grapheme = letters[index];
    const pair = `${letters[index]}${letters[index + 1] || ""}`.toLowerCase();

    if (QUECHUA_DIGRAPHS.has(pair)) {
      grapheme += letters[index + 1];
      index += 1;
    }

    if (letters[index + 1] === "'" || letters[index + 1] === "’") {
      grapheme += letters[index + 1];
      index += 1;
    }

    graphemes.push(grapheme);
  }

  return graphemes;
}

function hyphenateQuechuaWord(word, minimumLength = 12) {
  if (word.length < minimumLength || word.includes("@") || /\d/.test(word)) return word;

  const graphemes = quechuaGraphemes(word);
  const vowelPositions = graphemes
    .map((grapheme, index) => (QUECHUA_VOWELS.test(grapheme) ? index : -1))
    .filter((index) => index >= 0);

  if (vowelPositions.length < 4) return word;

  const breakBefore = new Set();

  for (let index = 0; index < vowelPositions.length - 1; index += 1) {
    const currentVowel = vowelPositions[index];
    const nextVowel = vowelPositions[index + 1];
    const consonants = nextVowel - currentVowel - 1;

    if (consonants === 1) breakBefore.add(currentVowel + 1);
    if (consonants > 1) breakBefore.add(nextVowel - 1);
  }

  return graphemes
    .map((grapheme, index) => `${breakBefore.has(index) ? SOFT_HYPHEN : ""}${grapheme}`)
    .join("");
}

function applyQuechuaWordBreaks(language) {
  const root = document.querySelector("body");
  if (!root) return;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes = [];

  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (!node.parentElement?.closest("script, style")) textNodes.push(node);
  }

  textNodes.forEach((node) => {
    const cleanText = node.nodeValue.replaceAll(SOFT_HYPHEN, "");
    const minimumLength = node.parentElement?.closest("h1, h2, h3") ? 9 : 12;
    node.nodeValue = language === "qu"
      ? cleanText.replace(
          /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ'’]+/g,
          (word) => hyphenateQuechuaWord(word, minimumLength)
        )
      : cleanText;
  });
}

function parseMarkdown(markdown) {
  const sections = {};
  markdown.split(/^##\s+/m).slice(1).forEach((block) => {
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
  let output = escapeHtml(value || "").replace(/\s{2}\n/g, "<br>").replace(/\n/g, " ");
  if (styled) output = output.replace(/\[acento\](.*?)\[\/acento\]/gi, '<span class="word-accent">$1</span>').replace(/\[contorno\](.*?)\[\/contorno\]/gi, '<span class="word-outline">$1</span>');
  return output;
}

const listItems = (value) => (value || "").split("\n").map((line) => line.replace(/^\s*-\s*/, "").trim()).filter(Boolean);
const setText = (selector, value) => { const element = document.querySelector(selector); if (element && value) element.textContent = value; };
const setHtml = (selector, value, styled = false) => { const element = document.querySelector(selector); if (element && value) element.innerHTML = formatText(value, styled); };

function applyGeneral(c) {
  const nav = listItems(c.navegacion);
  document.querySelectorAll(".main-nav a").forEach((link, index) => { if (nav[index]) link.textContent = nav[index]; });
  setHtml(".footer-name", c["nombre-institucional"]);
  setText(".footer-location", c["ubicacion-breve"]);
  setText(".footer-email", c.correo);
  setText(".footer-status", c["estado-del-sitio"]);
  const email = document.querySelector(".footer-email");
  if (email && c.correo) email.href = `mailto:${c.correo}`;
}

function applyInicio(c) {
  setHtml(".hero h1", c.titular, true);
  setText(".hero-bottom > p", c.descripcion);
  setHtml(".round-link .content-text", c.boton);
  setText(".mission", c.mision); setText(".vision", c.vision); setText(".objectives", c.objetivos);
  const items = listItems(c.cinta);
  if (items.length) document.querySelector(".ticker-track").innerHTML = [...items, ...items].map((item, index) => `<span>${escapeHtml(item)}</span><i>${index % 2 ? "▲" : "●"}</i>`).join("");
}

function applySection(name, c, fields) {
  setText(`#${name} .section-label .content-text`, c.etiqueta);
  setHtml(`#${name} .section-heading h2, #${name} > div > h2`, c.titular);
  setText(`#${name} .section-intro`, c.introduccion);
  fields.forEach((field) => setText(`#${name} [data-field="${field}"]`, c[field]));
}

function applyLicenciatura(c) {
  applySection("licenciatura", c, ["que-es-la-carrera", "que-hace-la-carrera", "modalidades-de-admision", "modalidades-de-titulacion"]);
  const facts = listItems(c.datos);
  document.querySelectorAll("#licenciatura .facts > div").forEach((fact, index) => {
    const [value, label] = (facts[index] || "").split("|").map((part) => part.trim());
    if (value) fact.querySelector("strong").textContent = value;
    if (label) fact.querySelector("span").textContent = label;
  });
}

function applyContacto(c) {
  setText("#contacto .section-label .content-text", c.etiqueta);
  setHtml(".contact-title", c.titular);
  setText(".contact-description", c.descripcion);
  setText(".contact-social", c["redes-sociales"]);
  setText(".contact-phone", c.numero);
  setText(".footer-email", c.correo);
}

function applyInterface(language) {
  const text = UI_TEXT[language];
  document.documentElement.lang = language;
  setText(".menu-label", text.menu);
  setText(".purpose-label", text.purposeLabel);
  setText(".mission-title", text.mission);
  setText(".vision-title", text.vision);
  setText(".objectives-title", text.objectives);

  document.querySelector(".language-switcher")?.setAttribute("aria-label", text.languageLabel);
  document.querySelector(".hero-media img")?.setAttribute("alt", text.heroAlt);

  document.querySelectorAll("#licenciatura .content-card h3").forEach((heading, index) => {
    if (text.degreeCards[index]) heading.textContent = text.degreeCards[index];
  });
  document.querySelectorAll("#investigacion .feature-card h3").forEach((heading, index) => {
    if (text.researchCards[index]) heading.textContent = text.researchCards[index];
  });
  document.querySelectorAll("#interaccion .interaction-card h3").forEach((heading, index) => {
    if (text.interactionCards[index]) heading.textContent = text.interactionCards[index];
  });

  document.querySelectorAll("[data-language]").forEach((button) => {
    const active = button.dataset.language === language;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

async function loadContent(language = currentLanguage) {
  try {
    document.body.classList.add("language-loading");
    let c = contentCache[language];

    if (!c) {
      const source = window.DGCV_CONTENT?.[language];
      if (!source) throw new Error(`Contenido no disponible: ${language}`);
      const entries = Object.entries(source).map(([name, markdown]) => [
        name,
        parseMarkdown(markdown),
      ]);
      c = Object.fromEntries(entries);
      contentCache[language] = c;
    }

    applyGeneral(c.general); applyInicio(c.inicio); applyLicenciatura(c.licenciatura);
    applySection("investigacion", c.investigacion, ["investigacion-formal", "investigacion-formativa", "investigacion-de-la-carrera", "investigacion-del-cidis"]);
    applySection("interaccion", c.interaccion, ["practicas-preprofesionales", "laboratorio"]);
    applySection("posgrado", c.posgrado, ["oferta-de-diplomados"]);
    setText("#posgrado .status-text", c.posgrado.estado);
    applyContacto(c.contacto);
    applyInterface(language);
    applyQuechuaWordBreaks(language);
    currentLanguage = language;
    saveLanguage(language);
  } catch (error) {
    console.error("No se pudo cargar el contenido Markdown:", error);
  } finally {
    document.body.classList.remove("language-loading");
  }
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-language]");
  if (!button) return;
  event.preventDefault();
  loadContent(button.dataset.language);
});

loadContent();
